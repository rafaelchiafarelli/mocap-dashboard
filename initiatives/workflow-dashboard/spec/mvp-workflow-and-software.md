# MVP Film Workflow and Software — Draft

## Status and intended outcome

**Status: draft for creator review.**

The product MVP succeeds when it helps the creator manage a film project from
its existing source material through production and post-production to a
reviewed, deliverable movie, while answering:

- What is done, underway, blocked, awaiting review, or still to do?
- What evidence supports the current status?
- Why is this work ready, blocked, or being deferred?
- Which independent packages can proceed in parallel?
- What would a changed decision or requirement affect?
- What is the next useful action?

The film is the intended project outcome; the dashboard is the visualization,
workflow-control, audit, and recovery tool. It does not create the film by
itself and cannot substitute for qualified creative or production work.

The creator is the only required user in the first pilot. Data and controls
must not make future collaboration impossible, but user accounts, shared
hosting, and multi-user permissions are not MVP requirements.

## MVP operating decisions

- The project folder is the sole durable source of truth. The dashboard may
  cache/index it, but must be able to rebuild its view from project files.
- The reusable application is a separate repository mounted at
  `mocap-studio/mocap-dashboard`, alongside the production tools. This
  initiative lives in that repository too (moved from `mocap-preprod` on
  2026-10-11). It is software for managing film
  projects, not film content.
- Existing briefs, worklists, source files, and production assets remain the
  authority for their content. The dashboard must not silently rewrite them.
- Dashboard-owned operational records, including links between a work package
  and a Claude Code run, are stored inside the selected project folder and
  contain references, not duplicate creative content.
- Store those records under `.film-workflow/` as versioned JSON, separate from
  authoritative briefs, worklists, and deliverables.
- The creator keeps using their Claude subscription. The dashboard does not
  use the Claude Agent SDK/API or require Anthropic API-key billing.
- The creator dispatches work through Claude Code's own interactive agent
  interface. The dashboard prepares task-scoped handoffs and reads the
  documented agent-session status output where supported.
- A Claude run is not a completed work package. Its outputs require artifact
  checks and human review.
- Parallel sessions are permitted only for independent tasks with compatible
  write scopes. Shared files such as the creative brief and production
  worklist must not be concurrently edited by multiple sessions.
- The mandatory consolidated readiness audit is the gate before production
  begins. Interim status checks are useful but are not mandatory formal gates
  at every stage.

## End-to-end film workflow represented by the MVP

The dashboard must represent the entire film lifecycle from project start to
delivery. It must distinguish the stages it can currently guide from later
stages whose detailed production procedures, agents, or acceptance templates
have not yet been authored. It must show those as unconfigured or capability
gaps, not as implicitly complete.

### 0. Project setup and source intake

**Purpose:** Establish what project is being managed and what materials
exist.

**Work:**

- Select or create a project folder.
- Record the title, intended finished-film outcome, and source locations.
- Inventory recognized workflow documents and relevant media/asset files
  without modifying them.
- Identify missing, unreadable, duplicate, or unsupported source materials.
- Confirm which files the dashboard is allowed to inspect.

**Handoff:** A source inventory and a clear next action for script/readiness
analysis. Project setup does not claim the story or production plan is ready.

### 1. Script and project readiness

**Purpose:** Understand the source script, production intent, and major
unknowns before planning downstream work.

**Work:**

- Run the Script Readiness Analyst against the approved source set.
- Record evidence-linked findings, assumptions, risks, and unanswered
  questions.
- For long material, track section analysis and consolidation as distinct
  packages with explicit scope.
- Do not begin specialist planning from partial coverage as though it were a
  complete-film assessment.

**Handoff:** A reviewed readiness report and a clear statement of its evidence
coverage and limitations.

### 2. Creator direction and decision record

**Purpose:** Capture creator-owned direction and make bounded decisions.

**Work:**

- Run the Pre-Production Decision Facilitator on a complete readiness
  assessment or an explicitly scoped portion.
- Ask one question at a time; observe the configured question limits.
- Record creator-approved decisions separately from proposals, unresolved
  items, and explicit deferrals.
- Give each deferral a revisit trigger and practical consequence.
- Do not turn every unknown into a blocking task.

**Handoff:** A creator-reviewed creative brief and a prioritized production
worklist with one assigned owner per package, deliverable contracts,
dependencies, and completion criteria.

### 3. Pre-production specifications

**Purpose:** Convert approved direction and source evidence into concrete
discipline-native specifications.

**Candidate workstreams:** story/editorial, visual development and sets,
characters, props/continuity, performance/editorial, cinematography,
lighting, sound, and other disciplines required by the film.

**Work:**

- Start only packages whose dependencies and authorization conditions are
  satisfied.
- Keep each package within its assigned specialist's discipline and output
  contract.
- Allow independent packages to run in parallel when their declared outputs
  do not conflict.
- Store proposals as proposals. Require creator approval where the brief,
  task, or stage criteria call for it.
- Map each specification to its sources and downstream consumers.
- Represent a missing qualified implementation role as a capability gap.

**Handoff:** Concrete specifications (for example, beat maps, shot/coverage
tables, prop registers, set/layout specifications, animation/performance
requirements, and cue sheets) with explicit approval and unresolved states.
A memo alone is not a specification, and a specification is not an
implemented asset.

### 4. Consolidated pre-production readiness audit

**Purpose:** Decide whether the project has the right current information and
assets to begin production.

**Work:**

- Audit required source materials, creator decisions, production
  specifications, required implementation assets, dependency completion,
  ownership/capability, and approvals against the defined production-entry
  criteria.
- Detect missing, stale, unreadable, conflicting, or unapproved inputs.
- Explain each finding with evidence and show downstream dependencies and
  likely rework if an input changes.
- Group non-blocking deferrals by revisit trigger; state their consequences.
- Present a clear result: `ready for creator review`, `not ready` with
  blocking findings, or `audit incomplete` with coverage limitations.

**Human gate:** The creator reviews the audit and explicitly authorizes or
declines starting production. The dashboard and audit agent do not approve
production automatically.

### 5. Production preparation and asset creation

**Purpose:** Turn approved specifications into buildable, reviewable
production assets.

**Candidate work:** model and rig characters; build sets and props; implement
cloth and other simulation behavior; prepare cameras, lighting, and scene
layouts; prepare capture/animation, recording, and continuity setups.

**Work:**

- Create implementation work packages only from approved upstream
  specifications.
- Assign a qualified human or execution agent to each package.
- Track implementation assets separately from specifications.
- Define checks connecting each asset to its source specification, approval,
  and consuming scene/task.
- Make missing execution roles and tools visible rather than assigning
  implementation to a planning analyst.

**Handoff:** Verified production assets or explicit, reviewed exceptions.
Detailed role assignments, asset schemas, per-discipline production
checklists, and the pilot film's actual implementation packages still need to be
established with the relevant production team; the dashboard must not invent
them.

### 6. Production and capture

**Purpose:** Record or generate the approved film performances and scene
content.

**Candidate work:** motion/performance capture, animation, scene assembly,
camera/blocking execution, lighting, simulation, dialogue/foley/ambience
recording, and continuity tracking as applicable.

**Work:**

- Track planned, active, reviewed, and accepted shots/scenes or equivalent
  production units.
- Link them to approved character, set, prop, camera, performance, lighting,
  and sound specifications.
- Record take/asset lineage, issues, pickups, and explicit rework impact.
- Permit parallel work only when dependency and write-scope checks pass.

**Handoff:** Reviewable scene/shot outputs with traceable source
specifications and known exceptions. The production-stage workflow and
execution roster are not yet complete in the current agent set.

### 7. Editorial and post-production

**Purpose:** Assemble and finish the movie while managing remaining
creative/technical decisions.

**Candidate work:** picture edit, targeted pickups/reshoots, sound edit and
mix, approved music if any, visual effects, color, titles, subtitles, and
accessibility deliverables.

**Work:**

- Track editorial versions and review notes as linked artifacts.
- Reopen deferred choices only when their revisit trigger occurs or the
  creator requests it.
- Show dependencies between picture changes, sound, effects, and delivery.
- Record decisions to accept changes, schedule pickups, or defer safely.

**Handoff:** A creator-reviewed candidate master and a list of outstanding
delivery checks. The picture-editing, compositing/color, and sound-mix tools
and acceptance checklists remain to be selected.

### 8. Final review and delivery

**Purpose:** Confirm that the finished movie and required deliverables meet
the creator's delivery criteria.

**Work:**

- Check the agreed picture/audio/export requirements, file integrity,
  versions, and any required subtitle/accessibility items.
- Record the reviewed master path, version, acceptance decision, and any
  outstanding limitations.
- Archive project materials and record the final completion evidence.

**Human gate:** The creator accepts the final delivery. The project becomes
`complete` only after this evidence is recorded; passing pre-production is
not project completion.

## Dashboard user workflow

1. **Open project:** select a folder; inspect it read-only first; confirm
   identity and source locations.
2. **Review discovery:** inspect recognized documents, statuses, parse
   warnings, missing/stale files, and unknown formats.
3. **Choose next work:** view stage, work-package graph, dependencies,
   ownership, deliverables, decisions, artifact approvals, and capability
   gaps.
4. **Prepare agent handoff:** choose one ready package; review the sources,
   output location, question cap, completion test, and write scope; generate
   the task-specific prompt and invocation instructions.
5. **Dispatch through Claude:** user opens/uses Claude Code Agent View and
   starts one or more independent sessions. The dashboard does not use hidden
   APIs or launch an unapproved run.
6. **Track runs:** identify and link each Claude session to its work package;
   show running, waiting for input, completed, failed, or stopped when the
   installed CLI exposes that status; persist a project-local run record.
7. **Review output:** inspect produced/changed paths, source references,
   completion evidence, and conflicts. Mark the work package awaiting review
   until a human verifies it.
8. **Promote/record result:** after review, record the result and approval
   using the project's existing authoritative files or an explicitly
   approved state update. Do not silently rewrite a brief, worklist, or
   artifact.
9. **Recompute impact/readiness:** refresh the file inventory and dependency
   view. If a source or decision changed, show affected downstream packages
   and request review where impact is unknown.
10. **Pause/resume:** persist enough project-local run/checkpoint metadata to
    resume manually after a long gap, even if Claude Code or the dashboard
    process is no longer running.
11. **Run production gate:** perform the consolidated pre-production audit;
    creator makes the go/no-go decision.
12. **Continue through film delivery:** use later-stage workflow definitions
    when available; surface unconfigured steps honestly rather than making a
    false completeness claim.

## MVP functional boundary

### Required for the first usable release

- Local, creator-only project discovery/opening without overwriting files.
- A full-film lifecycle view from intake through final delivery, with
  configured/unconfigured stages clearly distinguished.
- Read and link current Markdown workflow artifacts and ordinary project
  files; do not parse or index large media payloads by default.
- Display source-backed project, stage, work-package, decision, artifact,
  approval, and dependency state.
- Show why a package is ready/blocked and what could be affected by a
  requirement change.
- Produce bounded, copyable Claude Code handoffs for a selected work package.
- Support user-dispatched concurrent Claude Code sessions and map each
  observed session to one work package.
- Read agent-session state using only a documented Claude Code interface;
  offer manual refresh/linking if the CLI interface is unavailable or
  changes.
- Persist minimal run mapping, timestamps, checkpoints, and errors inside the
  project folder. Do not persist full conversations by default.
- Provide the mandatory consolidated pre-production readiness audit and
  human go/no-go review.
- Show conflict/overlap warnings and require human review before promoting
  outputs or resolving conflicts.
- Provide useful manual operation when Claude Code is unavailable.

### Deliberately not required for the first release

- Dashboard-initiated agent dispatch or direct API billing.
- Unattended creative interviews, approvals, source edits, commits, merges,
  or external notifications.
- Multi-user accounts, remote hosting, cloud project storage, or role-based
  access management.
- General-purpose scheduling, daemons, guaranteed always-on execution, or
  model sessions that survive machine shutdown.
- Replacing Claude Code, specialist agents, Blender, editing, sound, capture,
  or other production tools.
- A database needed to recover project state.

## Software and tools

### Needed to build the dashboard

| Software | Use | MVP status |
|---|---|---|
| Windows + WSL2 (Ubuntu) | Current development/runtime environment | Already available |
| Visual Studio Code with Remote - WSL | Edit and debug from the current workspace | Already available |
| Python 3.12 | Local app server (backend) and its tests | Same version as the rest of Mocap Studio (`DEPENDENCIES.md`) |
| Node.js 22 LTS or newer compatible LTS | Build and test the React UI only | Node 22 is already available here |
| npm | UI dependencies and build scripts | Already available |
| Git and GitHub | Version the standalone dashboard source and preserve project history | Already available |
| Current browser / VS Code forwarded port | Open the local dashboard UI | Already available |
| TypeScript + React + Vite | Typed local dashboard UI and development server | Proposed app dependencies |
| Python FastAPI + Pydantic local API service | Scoped filesystem discovery, project records, and read-only Claude status polling | Proposed app dependency (revised 2026-10-11 from Node.js + Fastify) |
| `mocap-contracts` (Harpia-generated) | Messages exchanged with other Mocap Studio applications | Pinned release, as in the other repositories |
| Markdown parser with GFM table support | Read current worklist/brief tables without ad hoc string parsing | Proposed app dependency |
| Schema validation (Pydantic) | Validate project-local operational records and CLI output | Proposed app dependency |
| pytest (backend) + Vitest/Testing Library (UI) | Tests for parsing and graph rules (backend) and rendering (UI) | Proposed app dependencies |
| Playwright | End-to-end project-open, worklist, review, and recovery checks | Proposed dev dependency |

Use exact package versions in the application lockfile when implementation
starts. Do not install a dependency globally just to make the MVP run.

### Needed to use agent handoffs

| Software | Use | Constraint |
|---|---|---|
| Claude Code CLI (`claude`) | User-authenticated Claude sessions and interactive Agent View | Install/update separately; dashboard checks availability and version |
| Claude subscription login | Start agents without Anthropic API-key billing | The dashboard cannot authenticate as the creator or bypass Claude's UI/permissions |
| Project custom-agent files | Supply the specialist role/instructions used by each handoff | Canonical `.claude/agents/` files in `mocap-preprod` (`.github/agents/` are generated Copilot adapters) |

The current implementation environment has Claude Code CLI `2.1.235`.
Version compatibility must be checked at runtime rather than assuming this
specific version forever.

The documented `claude agents --json` command can expose agent-session state
to scripts; Agent View is currently described by Anthropic as a research
preview. The app must treat the output as a versioned external integration,
validate it, and fall back to manual session linking/status when unavailable.
Never inspect or depend on undocumented files under `~/.claude`.

### Existing creative/production software

The dashboard organizes these tools; it does not replace them.

- **Blender and the Mocap Studio repositories** are the known animation,
  capture, and processing ecosystem. The registered repositories include
  `mocap-blender`, `mocap-capture`, `mocap-extract`, and related support
  projects. Exact per-project requirements depend on the production plan and
  target machine.
- **Audio utilities:** FFmpeg, Sox, or Audacity may be used for conversion
  and listening. A production DAW and recording/mixing workflow are not
  selected yet.
- **Picture editing, compositing, color, and final encoding tools** are not
  yet specified for any film. Select them as part of production workflow
  planning rather than silently adding them to the dashboard stack.
- **Audio generation models** (AudioCraft/ComfyUI) are optional experiments,
  not a required dependency. Score remains creator-triggered and unapproved
  unless explicitly selected.

This is the honest current inventory, not a final film-production shopping
list. Before a film enters production, define its execution packages and verify the
specific versions/installations of Blender, capture/extraction utilities,
picture editor, audio editor/DAW, compositing/color tools, encoders, and
required codecs on the target production machine. Do not install optional
generative-audio models just to build the dashboard.

### Not needed for this creator-only MVP

- No SQLite/PostgreSQL or cloud database.
- No hosting service or public internet endpoint.
- No Anthropic API key or Claude Agent SDK.
- No Docker requirement.
- No background daemon or external reminder provider.
- No new sound-generation model install unless the creator approves score
  exploration.

## Test and acceptance walkthroughs

The MVP is not accepted until these cases pass:

1. Open the pilot film project read-only; show existing brief, worklist, specialist outputs,
   and source document references without rewriting them.
2. Show approved direction separately from provisional options, deferred
   decisions, and open questions.
3. Show memo/specification/implementation asset as separate classes.
4. Parse a valid worklist row and reject or flag malformed/ambiguous rows
   without mapping them to success.
5. Show a package as ready only when its dependency and review conditions
   are satisfied.
6. Offer simultaneous runs only for independent packages; detect shared
   output path or shared-file conflicts and prevent unsafe parallel promotion.
7. Launch a task in Claude's own interface, then link its session to exactly
   one task and show its current status from supported session output.
8. Handle absent CLI, changed version, invalid JSON, failed session, waiting
   for input, and machine restart without inventing success.
9. Review agent output before it changes canonical task/approval state.
10. Change a decision/source reference and show impacted downstream work;
    report unknown impact when links are incomplete.
11. Run the consolidated pre-production readiness audit and let the creator
    explicitly accept or decline the production gate.
12. Show that later production/post-production definitions or executors are
    missing instead of declaring the film complete.

## Open items to settle before implementation

- Accept or revise this MVP scope and the end-to-end stage outline.
- Accept the proposed local web application architecture in the architecture
  decision record (Python backend + React UI, decided 2026-10-11).
- Confirm the first Claude CLI status adapter against the installed CLI; the
  implementation must version-check and retain the manual fallback.
- Define write-scope conflict behavior for non-Git project folders.
- Define the pilot film's production execution packages and qualified owners for
  asset types not covered by the current pre-production specialists. This is
  required to use the workflow to reach the movie, but not to implement the
  initial dashboard shell and discovery/status view.
- Select picture-editing, compositing/color, sound-recording/mix, and final
  delivery tools as production requirements become clear.
