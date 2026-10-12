import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

interface MarkdownDocument {
  path: string
  category: string
  sizeBytes: number
  modifiedAt: string
}

interface FilmInventory {
  title: string
  documents: MarkdownDocument[]
  scannedAt: string
  warnings: string[]
}

async function readError(response: Response): Promise<string> {
  const body: unknown = await response.json()
  if (typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string') {
    return body.error
  }
  return `Request failed (${response.status}).`
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function App() {
  const [filmRoot, setFilmRoot] = useState('')
  const [token, setToken] = useState('')
  const [inventory, setInventory] = useState<FilmInventory | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    void fetch('/api/session')
      .then(async (response) => {
        if (!response.ok) throw new Error(await readError(response))
        return response.json() as Promise<{ token: string }>
      })
      .then(({ token: sessionToken }) => {
        if (active) setToken(sessionToken)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not initialize the local dashboard session.')
      })
    return () => {
      active = false
    }
  }, [])

  async function inspectFilm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setInventory(null)

    try {
      const response = await fetch('/api/film/inspect', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-workflow-token': token,
        },
        body: JSON.stringify({ path: filmRoot }),
      })
      if (!response.ok) throw new Error(await readError(response))
      setInventory((await response.json()) as FilmInventory)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Film inventory failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Frame home">
          <span className="wordmark-icon">F</span>
          <span>FRAME<span className="wordmark-dot">.</span></span>
        </a>
        <span className="local-indicator"><span /> LOCAL WORKSPACE</span>
      </header>

      <section className="intro">
        <p className="eyebrow">FILM PRODUCTION WORKFLOW</p>
        <h1>A film is the deliverable.<br /><span>Make the work legible.</span></h1>
        <p className="intro-copy">See what is ready, what is blocked, and what still needs to happen — from script through final delivery.</p>
      </section>

      <section className="film-panel" aria-labelledby="film-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FILM SETUP</p>
            <h2 id="film-heading">Start with your film folder</h2>
          </div>
          <span className="read-only-tag">READ ONLY</span>
        </div>
        <form className="film-form" onSubmit={inspectFilm}>
          <label htmlFor="film-root">Absolute path to a film folder</label>
          <div className="input-row">
            <input
              id="film-root"
              value={filmRoot}
              onChange={(event) => setFilmRoot(event.target.value)}
              placeholder="/home/you/films/my-film"
              autoComplete="off"
              spellCheck={false}
              required
            />
            <button type="submit" disabled={loading || !token}>
              {loading ? 'Scanning…' : 'Inspect film'}
            </button>
          </div>
          <p className="helper-text">Only Markdown document names and file metadata are inventoried. No film files are changed.</p>
        </form>
      </section>

      {error && <div className="notice error-notice" role="alert">{error}</div>}

      {inventory && (
        <section className="results" aria-live="polite">
          <div className="result-heading">
            <div>
              <p className="eyebrow">FILM INVENTORY</p>
              <h2>{inventory.title}</h2>
              <p className="muted">Scanned {new Date(inventory.scannedAt).toLocaleString()}</p>
            </div>
            <div className="document-count">
              <strong>{inventory.documents.length}</strong>
              <span>Markdown {inventory.documents.length === 1 ? 'document' : 'documents'}</span>
            </div>
          </div>

          {inventory.warnings.map((warning) => <div className="notice warning-notice" key={warning}>{warning}</div>)}

          {inventory.documents.length === 0 ? (
            <div className="empty-state">No Markdown documents found within the scan limits.</div>
          ) : (
            <div className="document-list">
              {inventory.documents.map((document) => (
                <article className="document-row" key={document.path}>
                  <span className="document-icon" aria-hidden="true">MD</span>
                  <div className="document-info">
                    <strong>{document.path}</strong>
                    <span>{document.category}</span>
                  </div>
                  <span className="document-meta">{formatBytes(document.sizeBytes)}</span>
                  <span className="document-status">Not yet interpreted</span>
                </article>
              ))}
            </div>
          )}
          <p className="scope-note">This first slice inventories documents only. It does not infer task status or production readiness from filenames.</p>
        </section>
      )}

      <footer className="footer">
        <span>FRAME WORKFLOW</span>
        <span>THE FILM FOLDER REMAINS THE SOURCE OF TRUTH</span>
      </footer>
    </main>
  )
}

export default App
