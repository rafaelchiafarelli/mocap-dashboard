import { lstat, readdir, realpath, stat } from 'node:fs/promises'
import { basename, dirname, relative, resolve, sep } from 'node:path'

const MAX_DEPTH = 5
const MAX_MARKDOWN_FILES = 500
const IGNORED_DIRECTORIES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.venv',
  'venv',
  '__pycache__',
])

export type DocumentCategory =
  | 'Script/source'
  | 'Brief/direction'
  | 'Worklist'
  | 'Readiness/assessment'
  | 'Workflow'
  | 'Other Markdown'

export interface MarkdownDocument {
  path: string
  category: DocumentCategory
  sizeBytes: number
  modifiedAt: string
}

export interface ProjectInventory {
  title: string
  documents: MarkdownDocument[]
  scannedAt: string
  warnings: string[]
}

export class ProjectScanError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProjectScanError'
  }
}

function isInsideRoot(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate)
  return pathFromRoot === '' || (pathFromRoot !== '..' && !pathFromRoot.startsWith(`..${sep}`))
}

function categoryFor(path: string): DocumentCategory {
  const name = basename(path).toLowerCase()
  if (/script|screenplay/.test(name)) return 'Script/source'
  if (/brief|creative-direction/.test(name)) return 'Brief/direction'
  if (/worklist|work-package/.test(name)) return 'Worklist'
  if (/readiness|assessment|audit/.test(name)) return 'Readiness/assessment'
  if (/workflow|production-plan/.test(name)) return 'Workflow'
  return 'Other Markdown'
}

export async function scanProject(selectedPath: string): Promise<ProjectInventory> {
  let root: string
  try {
    root = await realpath(resolve(selectedPath))
  } catch {
    throw new ProjectScanError('The selected project folder does not exist or cannot be accessed.')
  }

  let rootStats
  try {
    rootStats = await stat(root)
  } catch {
    throw new ProjectScanError('The selected project folder cannot be accessed.')
  }
  if (!rootStats.isDirectory()) {
    throw new ProjectScanError('Select a folder, not a file.')
  }

  const documents: MarkdownDocument[] = []
  const warnings: string[] = []
  let limitReached = false
  let depthLimitReached = false

  async function visit(directory: string, depth: number): Promise<void> {
    if (depth > MAX_DEPTH) {
      depthLimitReached = true
      return
    }
    if (limitReached) return

    const entries = await readdir(directory, { withFileTypes: true })
    entries.sort((left, right) => left.name.localeCompare(right.name))

    for (const entry of entries) {
      if (limitReached) return
      if (entry.isSymbolicLink()) continue

      const absolutePath = resolve(directory, entry.name)
      if (!isInsideRoot(root, absolutePath)) continue

      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          await visit(absolutePath, depth + 1)
        }
        continue
      }

      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) continue
      if (documents.length >= MAX_MARKDOWN_FILES) {
        limitReached = true
        warnings.push(`Only the first ${MAX_MARKDOWN_FILES} Markdown files were inventoried.`)
        return
      }

      const fileStats = await lstat(absolutePath)
      if (!fileStats.isFile()) continue
      const canonicalPath = await realpath(absolutePath)
      if (!isInsideRoot(root, canonicalPath)) continue

      documents.push({
        path: relative(root, canonicalPath).split(sep).join('/'),
        category: categoryFor(entry.name),
        sizeBytes: fileStats.size,
        modifiedAt: fileStats.mtime.toISOString(),
      })
    }
  }

  try {
    await visit(root, 0)
  } catch (error) {
    throw new ProjectScanError(
      `Could not finish the read-only document inventory: ${error instanceof Error ? error.message : 'unknown filesystem error'}`,
    )
  }

  if (depthLimitReached) {
    warnings.push(`Some Markdown files may be deeper than the ${MAX_DEPTH}-level scan limit.`)
  }

  return {
    title: basename(root) || dirname(root),
    documents,
    scannedAt: new Date().toISOString(),
    warnings,
  }
}
