import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { scanProject } from './project-inventory.js'

const temporaryDirectories: string[] = []

async function createTemporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'mocap-dashboard-'))
  temporaryDirectories.push(directory)
  return directory
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

describe('scanProject', () => {
  it('lists Markdown files with relative paths and descriptive categories', async () => {
    const root = await createTemporaryDirectory()
    await mkdir(join(root, 'planning'))
    await writeFile(join(root, 'planning', 'production-worklist.md'), '# Worklist\n')
    await writeFile(join(root, 'script.md'), '# Script\n')

    const inventory = await scanProject(root)

    expect(inventory.title).toBe(root.split('/').at(-1))
    expect(inventory.documents.map(({ path, category }) => [path, category])).toEqual([
      ['planning/production-worklist.md', 'Worklist'],
      ['script.md', 'Script/source'],
    ])
    expect(inventory.warnings).toEqual([])
  })

  it('does not follow directory symlinks outside the selected project', async () => {
    const root = await createTemporaryDirectory()
    const outside = await createTemporaryDirectory()
    await writeFile(join(outside, 'private.md'), '# Not in the selected project\n')
    await symlink(outside, join(root, 'external'))

    const inventory = await scanProject(root)

    expect(inventory.documents).toEqual([])
  })

  it('rejects a file instead of treating it as a project root', async () => {
    const root = await createTemporaryDirectory()
    const file = join(root, 'brief.md')
    await writeFile(file, '# Brief\n')

    await expect(scanProject(file)).rejects.toThrow('Select a folder, not a file.')
  })
})
