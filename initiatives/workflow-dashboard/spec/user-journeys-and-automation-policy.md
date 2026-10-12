# User Journeys and Automation Policy — Draft

## Status and MVP user

**Status: draft for creator review.**

The MVP is creator-operated and local to one workstation/film folder. It
must remain understandable to a future collaborator, but does not implement
accounts or shared authorization in its first release.

The film folder is the only durable source of truth. Dashboard state that
must survive restart is stored within that folder; live Claude session state
is observed from Claude Code and mirrored locally as a timestamped,
recoverable record.

## Journey 1 — Start or open a film

- **User:** Creator.
- **Starting condition:** New film folder or existing folder with
  screenplay, brief, readiness report, worklist, production artifacts, or a
  partial subset.
- **Action:** Select folder, inspect discovered files and film identity,
  confirm intended outcome, review parse/access warnings, and authorize
  film-local dashboard metadata initialization if needed.
- **Resulting state:** Film is identified; known stages and artifacts are
  displayed with current/unknown/missing/unreadable conditions.
- **Handoff:** User chooses the next valid stage action or starts discovery.
- **Recovery:** Reopen the same film folder and reconstruct state from its
  files. If metadata is invalid, show the error and keep original documents
  untouched.
- **MVP boundary:** No account creation, cloud registration, source rewrite,
  or hidden database is required.

## Journey 2 — Analyze source and establish creator direction

- **User:** Creator, using the readiness and decision-facilitator agents.
- **Starting condition:** Source set selected; coverage may be complete or
  intentionally scoped.
- **Action:** Run readiness analysis, review evidence/limitations, conduct a
  bounded creator interview, and record approved directions or deferrals.
- **Resulting state:** Readiness report and creative brief are linked;
  creator-approved decisions, proposals, open questions, and deferrals are
  visibly distinct.
- **Handoff:** Create/confirm the production worklist with deliverable
  contracts, single owners, dependencies, and completion checks.
- **Recovery:** Resume from film documents and recorded decisions. Never
  interpret partial analysis as a whole-film conclusion.
- **MVP boundary:** The tool does not let an agent make or silently approve
  creative decisions.

## Journey 3 — Select work and start independent agents in parallel

- **User:** Creator, with Claude Code Agent View.
- **Starting condition:** Worklist exists; selected packages are ready and
  have satisfied dependencies.
- **Action:** Compare next actions; inspect assigned agent, sources, output
  path, question cap, acceptance criteria, and possible write conflicts.
  Generate a copyable handoff for each chosen package. The creator dispatches
  the sessions in Claude Code Agent View and explicitly links each observed
  session to its work-package ID.
- **Resulting state:** Run records identify task/session relationships and
  last observed status. Independent packages may be active simultaneously.
- **Handoff:** Agent questions return to the creator in Claude Code; outputs
  return to the work-package review view.
- **Recovery:** If the dashboard or machine stops, sessions may continue
  according to Claude Code behavior; the dashboard reloads the saved
  film-local run mapping and refreshes current CLI state when available.
- **Safety:** Never dispatch a task with unmet dependencies, missing required
  approval, ambiguous ownership, or overlapping writes with another active
  task. If a task may edit shared files (such as the creative brief or
  worklist), serialize that edit or require an isolated worktree/review.
  Prompt instructions are not a hard filesystem sandbox.
- **MVP boundary:** The user dispatches from Claude's documented interface.
  The dashboard does not invoke an API, accept permissions, or launch
  unattended creative work.

## Journey 4 — Review an agent result

- **User:** Creator.
- **Starting condition:** A linked Claude session reports completed,
  failed/stopped, waiting for input, or cannot be refreshed.
- **Action:** Inspect changed/produced paths and evidence; compare against the
  task contract and source; resolve conflicts; accept, request changes, or
  reject the deliverable.
- **Resulting state:** Work package is `awaiting-review`, then completed only
  after a human verifies the deliverable condition. Artifact approval is
  separately recorded.
- **Handoff:** Approved specification/assets may unlock downstream work;
  proposals return to the creator decision process as needed.
- **Recovery:** Retain the last observed status and timestamp. If the CLI
  cannot report current state, label it stale and offer manual status/linking.
- **Safety:** Session success alone does not mark a task complete, approve a
  decision, or pass a stage gate.

## Journey 5 — Respond to a changed requirement

- **User:** Creator.
- **Starting condition:** An approved or proposed source, decision, or
  specification changes.
- **Action:** Record the changed item in its authoritative film file and
  refresh the dashboard scan.
- **Resulting state:** The dashboard follows dependency/provenance links to
  list affected artifacts, work packages, and stages with reasons. Unknown
  impact is explicitly marked for review.
- **Handoff:** The creator selects targeted re-review/rework, safely defers
  it with a trigger, or records that no downstream change is needed and why.
- **Recovery:** Previous records remain traceable; the app does not silently
  overwrite an approval or downstream asset.
- **Safety:** Impact suggestions are advisory. Creator or qualified lead
  decides whether to reopen work.

## Journey 6 — Run the pre-production readiness audit

- **User:** Creator, optionally using a readiness-audit agent.
- **Starting condition:** Pre-production packages have been explored and
  their outputs reviewed.
- **Action:** Audit required current sources, decisions, specs, assets,
  approvals, dependencies, owners, and capability coverage against the
  production-entry checklist.
- **Resulting state:** `ready for creator review`, `not ready` with blockers,
  or `audit incomplete` with coverage limitations; each claim cites
  evidence.
- **Handoff:** Creator explicitly authorizes or declines beginning production.
- **Recovery:** Audit can be rerun after gaps are resolved; prior audit
  reports remain linked but are marked outdated when their inputs change.
- **Safety:** An agent/dashboard never authorizes the transition.

## Journey 7 — Continue through production and delivery

- **User:** Creator and future qualified production collaborators.
- **Starting condition:** Creator has authorized production; production
  workflow definitions exist or are being defined.
- **Action:** Track approved specs into asset creation, capture/animation,
  editorial, post-production, review, and final delivery.
- **Resulting state:** Production assets and finished-film deliverables have
  evidence, owners, review state, and downstream links.
- **Handoff:** Final creator acceptance and delivery/archive record.
- **Recovery:** Work resumes from film-local records and actual files.
- **MVP boundary:** Dashboard supports the lifecycle model and exposes
  unconfigured stages, but cannot claim a complete production workflow until
  qualified roles, per-stage acceptance criteria, and required software are
  defined. No production agent or editor is invented by the application.

## Journey 8 — Pause, restart, or recover an error

- **User:** Creator.
- **Starting condition:** User pauses, dashboard crashes, CLI exits, session
  fails, network/auth is unavailable, or a film file becomes malformed.
- **Action:** Reopen the film and inspect the last confirmed checkpoint,
  last observed CLI state, stale records, and errors.
- **Resulting state:** The user sees what is confirmed, what is uncertain,
  and safe manual next steps.
- **Handoff:** Resume monitoring/agent session where supported, relaunch
  deliberately, or continue manually.
- **Recovery:** No process is assumed to remain alive indefinitely. A machine
  shutdown may stop sessions; report this instead of claiming they continued.
- **Safety:** Do not retry failed or uncertain writes automatically. Do not
  discard partial outputs without creator authorization.

## Journey 9 — Future collaborator handoff (post-MVP)

- **User:** Creator and an authorized collaborator.
- **Starting condition:** Film files and workflow records are shared using
  an explicitly selected access/backup mechanism.
- **Action:** Collaborator opens the film, reviews status/evidence and
  responsibilities, then accepts a package or handoff.
- **Resulting state:** Ownership and review actions are attributable.
- **Handoff:** Work resumes without private chat history as the only record.
- **Recovery:** Conflicting edits are shown and resolved by an authorized
  human.
- **Post-MVP work:** Identity, access control, concurrent human edits,
  remote storage, backup, and dispute resolution must be designed before
  multi-user deployment.

## Authorization policy

| Action | Authorization |
|---|---|
| Read-only discovery of selected film files | Creator selects the film root and confirms scope |
| Create dashboard operational directory | Explicit creator approval on first use |
| Generate a handoff prompt | Creator selects one authorized, ready task |
| Start Claude session | Creator dispatches it through Claude Code Agent View |
| Agent read/write/command/network access | Governed by Claude Code and OS controls, not by dashboard claims |
| Modify source documents or promote agent output | Human review and explicit confirmation |
| Change creator-owned direction or approve a decision | Creator only |
| Pass production-entry readiness gate | Creator explicitly confirms after reviewing cited audit |
| Delete/overwrite film files or resolve conflicting outputs | Explicit creator authorization |
| External notification, scheduled unattended run, or hosted sharing | Not in MVP; requires separate opt-in design |

## Automation and observability policy

- Every observed run shows film, work-package ID, agent/session identity,
  current state, last observed timestamp, last checkpoint if available,
  produced/changed paths when known, and surfaced errors.
- Status values from external CLI output are validated and normalized; raw
  unrecognized values remain visible as `unknown`/`needs-review`.
- Polling is bounded, read-only, cancellable, and does not keep Claude
  sessions alive.
- User starts and links sessions; dashboard may refresh status only while
  open or by explicit user action. No background service is required.
- Persist minimal metadata in the film folder; do not store full private
  conversations or credentials by default.
- A lost connection, unsupported CLI version, invalid output, or failed
  process must show an error and manual fallback.
- No success-shaped defaults. `unknown`, `stale`, and `incomplete` are
  first-class visible outcomes.
- Do not promise file/tool isolation from prompt instructions. If the
  environment cannot technically enforce a write boundary, restrict parallel
  tasks by declared paths and require human review; otherwise run them
  sequentially.
- Automation never converts a proposal to approval, a memo to a
  specification, or a specification to an implemented asset.
