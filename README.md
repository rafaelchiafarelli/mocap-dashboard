# Frame Workflow Dashboard

A local-first film workflow dashboard. The project folder remains the durable
source of truth; this first application slice inventories Markdown documents
without changing or interpreting their contents.

## Stack

- **Backend: Python 3.12, FastAPI** (`mocap_dashboard/`), decided 2026-10-11.
  The architecture decision record is in `initiatives/workflow-dashboard/spec/`.
- **UI: React + Vite** (`src/`), the only non-Python part. It talks only to its
  own backend.
- Messages to other Mocap Studio applications go through Harpia contracts in
  `mocap-contracts`. This first slice doesn't exchange any yet.

## Requirements

- Docker (to run it)
- Python 3.12 (to develop the backend)
- Node.js 22 or newer and npm (to build the UI only)

## Run (Docker, the supported way)

```sh
make up                          # build the image, serve on http://127.0.0.1:4174
make up PROJECTS=/path/to/films  # folder holding the film projects (default /mnt/g)
```

The film projects folder is mounted at the same path inside the container, so
you type the same path in the UI. The port is published on loopback only.
Decided 2026-10-12: the dashboard runs in Docker, like the other Python repos.

## Develop locally

```sh
make venv            # Python backend + test deps in .venv
npm ci
make dev             # API on 127.0.0.1:4174 + Vite dev server on :5173
# or: make run       # build the UI and serve it from the API on :4174
```

Open the loopback URL. Enter the absolute path to a film project folder and
select **Inspect project**. The inventory is read-only and limited to Markdown
files, five directory levels deep, with common generated directories excluded.

The first slice does not infer task status, readiness, or completion from
filenames. It does not initialize `.film-workflow/` or persist selected
projects. Those behaviors need to follow the accepted project state contract
and real project-document formats.

## Verification

```sh
make test            # pytest (backend), vitest + typecheck (UI)
npm run build
```

The API binds to `127.0.0.1` by default. It accepts local dashboard origins
only and requires a per-process token for project inspection. Do not expose
the development server to a network.
