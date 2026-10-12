# Architecture Decision Record — Production Workflow Dashboard

## Status

**Proposed for creator review.** Accepted parts: Python backend on FastAPI +
Pydantic with the React UI kept (creator decision 2026-10-11); runs in
Docker, published on loopback only (creator decision 2026-10-12).

This draft selects a local web app, Claude Code Agent View integration, and
project-local JSON operational records as the recommended MVP baseline.

## Context

The dashboard must let a creator inspect and guide a film project stored in a
project folder. That folder is the sole durable source of truth. The product
must visualize the path from source/script through final film delivery,
prepare bounded work handoffs, track multiple Claude sessions, and audit
pre-production readiness. The creator wants to use a Claude subscription,
not pay for application-level Anthropic API access.

The existing project files are primarily Markdown and media/production
artifacts. The app must not silently rewrite them or require a separate
database to reconstruct project state.

## Decision drivers

1. Project folder remains authoritative and portable.
2. Works in the current Windows/WSL2 + VS Code Remote workflow.
3. Supports a local single-user MVP before multi-user hosting.
4. Does not require Anthropic API-key billing.
5. Uses a documented, permission-aware Claude Code interface; never relies on
   private files or reverse-engineered endpoints.
6. Tracks parallel independent sessions without treating session success as
   work approval.
7. Keeps safe manual operation when Claude or the dashboard is unavailable.
8. Minimizes new infrastructure and maintenance.

## Considered approaches

### A. Local web application + Claude Code Agent View — recommended

- Run a local Python service in the same WSL environment as the project
  folder and Claude Code CLI.
- Serve a React dashboard on localhost and use VS Code's forwarded port or a
  local browser to display it.
- Read project files through an explicit project-root boundary.
- Let the creator dispatch runs inside Claude Code's interactive Agent View.
- Read session state using documented `claude agents --json --cwd <project>
  --all` output; persist only the selected task/session mapping and minimal
  run/checkpoint state inside the project folder.
- Prepare, display, and copy a bounded task handoff; do not automate
  unattended agent dispatch or attempt to accept permissions for the user.

**Advantages:** Compatible with the creator's current subscription workflow;
keeps files local; avoids API keys, database services, and cloud hosting;
offers documented CLI status output.

**Limitations:** Agent View is a research preview; the dashboard cannot
guarantee an agent's filesystem or shell permissions; the user must dispatch
and answer permission/creative prompts in Claude; CLI status schema changes
must be handled; it is a local creator tool, not a shared web service.

### B. Local application using the Claude Agent SDK

The Agent SDK can run Claude agents from an application and supports tools,
permissions, sessions, and concurrent workflows.

**Rejected for this MVP:** Anthropic's SDK documentation says third-party
applications must use API-key authentication unless separately approved;
claude.ai login/rate limits cannot simply be embedded. This conflicts with the
creator's explicit choice to use their Claude subscription and not add API
billing. Reconsider only if the creator later approves API usage or the
commercial/authentication terms change.

### C. VS Code extension only

**Deferred:** A VS Code extension could provide a native workspace panel, but
it ties the dashboard to one editor extension host and complicates filesystem
and agent-session control. The local web UI can still be opened from VS Code
and preserves a simpler editor-independent core.

### D. Hosted multi-user web application

**Deferred:** Requires shared storage, authentication, authorization,
deployment, backups, network security, and conflict resolution. This is not
needed for the creator-only pilot and would weaken the simple project-folder
source-of-truth model unless designed deliberately later.

## Proposed architecture

The dashboard is a separate application repository mounted at
`mocap-studio/mocap-dashboard`. This initiative lives in that repository.

### Runtime and UI

- **Revised 2026-10-11 (creator decision):** the backend is **Python**, like
  every other Mocap Studio application; the React UI is kept. This replaces the
  earlier Node.js/Fastify proposal.
- One local Python 3.12 service serves the built UI and a narrow local API
  (FastAPI + Pydantic for validated routes for project discovery, parsed
  views, and run-status snapshots).
- React + Vite (TypeScript) provides the browser UI. It is the only non-Python
  part of the dashboard and talks only to its own backend.
- Messages between the dashboard and other Mocap Studio applications go
  through **Harpia** contracts in `mocap-contracts`, used through Harpia's
  documented interface only. The browser-to-own-backend API is not an
  inter-application protocol and is exempt.
- Bind the server to loopback by default. Do not expose it to a LAN or public
  host in the MVP.
- Protect local API mutations with a per-launch session token and same-origin
  checks; validate host/origin headers, disable cross-origin access, and do
  not treat loopback binding alone as authorization.
- The user explicitly selects one project root; all project file operations
  are resolved and checked against that root.

### Project data and persistence

- Existing project-owned files remain the authority for their own content:
  creative brief for creative direction, worklist for packages and statuses,
  artifact files for deliverables, and source materials for evidence.
- Dashboard-owned operational records live under one versioned hidden
  directory in the project root: `.film-workflow/`. Use JSON records with a
  `schemaVersion` field; the initial layout is `project.json`,
  `runs/<run-id>.json`, and `audits/<audit-id>.md`. `project.json` stores
  project identity and paths to canonical documents, not copies of decisions
  or work-package content. A run record stores only the task/session
  association, observed status/timestamps, checkpoint and changed-path
  references, and surfaced errors. An audit report links to source evidence.
  Do not duplicate full briefs, conversations, or agent output.
- No database is required. Derived indexes are in-memory, disposable, and
  rebuildable from the project files and `.film-workflow/` records.
- Every operational record has a schema version. Unsupported or malformed
  records produce a visible error and must not be silently reset.
- Before first write, inspect the project in read-only mode and ask for
  explicit approval to initialize the operational directory.
- Avoid logging API credentials, full private prompts, full transcripts, or
  unrelated file contents.

### Markdown and artifact discovery

- Parse only documented project workflow formats and configured roots.
- Use a Markdown parser with GitHub-Flavored Markdown table support rather
  than bespoke splitting on pipe characters.
- Treat unknown status vocabulary as `needs-review`.
- Keep project-relative paths as references; do not embed absolute local
  paths in portable state where avoidable.
- Inventory large media by path, type, size, and modification metadata only;
  do not ingest media payloads by default.
- Never follow a symlink outside the user-approved project root without an
  explicit authorization step.
- Validate every path after resolution and before read/write; reject traversal,
  symlink escapes, and paths outside the selected project root.

### Claude integration and agent tracking

- The first provider adapter targets the installed Claude Code CLI, not an
  API SDK.
- Agent dispatch remains user-initiated in Claude Agent View. The dashboard
  creates a handoff with task ID, assigned custom agent, permitted inputs,
  expected output paths, dependencies, question cap, and completion check.
- Before dispatch, show the user the exact task scope and proposed
  parallel-conflict check.
- Use the documented JSON status command when available. Parse and validate
  its output; handle missing binary, incompatible schema, auth problems, and
  nonzero exit status as explicit errors.
- The user links a discovered Claude session to a task; do not guess from
  free-form names or assume one run equals one completed task.
- Store run ID/session ID, task ID, observed status, timestamps, changed
  paths where known, and errors/checkpoints in the project-local operational
  directory. Full chat content is not stored by default.
- Provide manual status/linking and copyable handoffs if CLI monitoring is
  unavailable. Never inspect undocumented `~/.claude` internals.

### Parallelism and write safety

- Treat the user-approved work-package dependency graph and declared
  output/write paths as the scheduling boundary.
- Do not recommend starting a package whose dependencies are unsatisfied,
  whose single owner is missing, or whose required input approval is pending.
- Do not run two packages in parallel when their declared write paths overlap
  or either may edit a shared source file such as the brief or worklist.
- Keep specialist deliverables in task-specific paths. Apply shared
  worklist/brief status changes sequentially after specialist output review.
- When write scope is unknown, report `conflict-unknown` and require serial
  execution or explicit creator review.
- Claude Code permission prompts and workspace restrictions remain controlled
  by Claude Code. Agent instructions and dashboard write-path labels are not
  OS-level sandboxes; the UI must say so clearly.
- Do not use bypass-permission modes. Do not claim that the dashboard has
  confined an agent unless an actual OS-level boundary is in effect.

### Failure and recovery

- The dashboard process is not required to remain alive for Claude sessions
  to continue.
- Persist the last observed session status and timestamp to the project
  folder; clearly label it stale if refresh fails.
- On restart, reload project state, re-read Claude status, and reconcile
  without overwriting newer project files.
- Expose failures and partial writes; provide manual refresh and handoff
  options.
- Pause/cancel semantics apply only where the Claude interface exposes them;
  otherwise tell the user how to act in Claude Code.

## Software inventory

### Required local tools

- Windows + WSL2 Ubuntu for the current creator workstation.
- Visual Studio Code + Remote - WSL for editing/running the tool in the
  current environment.
- Python 3.12 for the backend (the Mocap Studio standard).
- Node.js 22 LTS and npm, only to build and test the React UI.
- Git and GitHub for versioning the standalone application source.
- A browser or VS Code forwarded browser view.
- Claude Code CLI authenticated through the creator's subscription. No API
  key is required by the selected approach.

### Proposed application packages

- TypeScript, React, and Vite for the UI.
- Python FastAPI + Uvicorn for the local filesystem/status API.
- Markdown/GFM parser for existing worklist and brief tables.
- Pydantic to validate local records and CLI JSON.
- pytest for the backend; Vitest and Testing Library for UI components.
- Playwright for end-to-end project-opening and review flows.

Pin exact versions in a hashed Python lockfile (`requirements.lock`) and in
`package-lock.json`. Run the first prototype against the pilot film's files and current Claude
CLI before declaring the provider integration supported.

### Not required

- SQL database, cloud host, shared remote storage, notification
  service, direct Claude API, Anthropic API key, or always-on machine.
- A production editor/audio suite bundled into the dashboard.
- Install of AudioCraft or ComfyUI unless creator-approved sound exploration
  requires it.

## Consequences and risks

- Subscription authentication remains outside the dashboard; the creator
  must sign into Claude Code normally.
- `claude agents` is documented as a research-preview feature. Monitoring
  must be optional and have manual fallback. The MVP's main view remains
  useful if the CLI JSON format changes.
- The dashboard can observe and guide parallel work, but cannot guarantee
  Claude's file-write confinement merely through prompts or UI labels.
- Projects that are not Git repositories can still be browsed and tracked,
  but lack version-control rollback. Parallel writing to shared files must
  therefore be prohibited, not merely warned about.
- The initial implementation is local, creator-only, and tied to the
  selected workstation's available filesystem and Claude Code installation.
- The full movie lifecycle can be visualized, but production/post-production
  templates and qualified execution agents still need to be defined.
- A future multi-user product will need a separate decision on locking,
  authority, conflict resolution, authentication, and backups.

## Acceptance proof before the dashboard MVP is considered viable

1. The dashboard opens the pilot film project in read-only discovery mode and identifies
   existing work without writing to its source documents.
2. It creates its project-local operational directory only after explicit
   creator approval.
3. It can generate a task handoff and the creator can launch that task in
   Claude Code's documented interactive interface.
4. It can read/link a task's Claude session status from documented CLI JSON,
   or clearly use manual fallback if the command is unavailable.
5. At least two independent tasks can run concurrently; shared-file/path
   conflicts are blocked or require creator review.
6. A malformed or stale source/record, missing CLI, or failed run produces
   an explicit visible problem, never a success-shaped default.
7. A specialist run finishing does not automatically mark its work package
   complete or approve its deliverables.
8. A pre-production audit explains evidence, limitations, gaps, deferrals,
   and downstream impact; only the creator authorizes production entry.
9. The application, project records, and recovery procedure work without a
   cloud database or background process.

## References

- [Claude Code Agent View](https://code.claude.com/docs/en/agent-view) —
  background sessions, interactive dispatch, and documented JSON status
  reading; currently identified as research preview.
- [Claude Code permissions](https://code.claude.com/docs/en/permissions) —
  permission modes, working-directory scope, and user-controlled approvals.
- [Claude Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) —
  application embedding and its API-key authentication restriction for
  third-party apps; rejected for this subscription-based MVP.
