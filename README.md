# Frame Workflow Dashboard

A local-first film workflow dashboard. The project folder remains the durable
source of truth; this first application slice inventories Markdown documents
without changing or interpreting their contents.

## Stack status

The backend is moving to **Python** (decided 2026-10-11, see the architecture
decision record in `mocap-preprod/initiatives/workflow-dashboard/spec/`). The
React UI under `src/` stays. The current Node.js/Fastify server in
`src/server/` is the first Copilot slice, and a Python port will replace it.
Don't extend it. Messages to other Mocap Studio applications go through
Harpia contracts in `mocap-contracts`.

## Requirements

- Node.js 22 or newer
- npm

## Run locally

```sh
npm ci
npm run dev
```

Open the loopback URL printed by Vite. Enter the absolute path to a film
project folder and select **Inspect project**. The inventory is read-only and
limited to Markdown files, five directory levels deep, with common generated
directories excluded.

The first slice does not infer task status, readiness, or completion from
filenames. It does not initialize `.film-workflow/` or persist selected
projects. Those behaviors need to follow the accepted project state contract
and real project-document formats.

## Verification

```sh
npm test
npm run typecheck
npm run build
```

The API binds to `127.0.0.1` by default. It accepts local dashboard origins
only and requires a per-process token for project inspection. Do not expose
the development server to a network.
