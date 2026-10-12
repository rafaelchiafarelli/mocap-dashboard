# Workflow State Contract — Draft for Creator Review

## Purpose and review status

This contract defines the project information the workflow dashboard must
show and preserve so a creator can understand what is done, what is underway,
what remains, why the current state is justified, and what a changed
requirement would affect.

**Status: draft.** This is a proposed state model for review, not an approved
technical architecture or a claim that every production discipline already
has a defined agent or workflow.

The product outcome is a finished movie. The dashboard is the visibility,
coordination, readiness-check, and automation tool; it does not itself create
or approve the film's creative or production assets.

## Source of truth

- The film project folder is the sole durable source of truth for project
  workflow state, source material, decisions, specifications, implementation
  assets, and agent-run records.
- A dashboard may parse, index, and temporarily cache project data to present
  views. A cache is disposable and must never be treated as newer or more
  authoritative than the project files.
- Durable state written by the dashboard or an agent must be written within
  the project folder. No separate database may be required to reconstruct the
  project's current state.
- Existing project documents remain authoritative for the information they
  own. The contract does not require copying the full contents of briefs,
  scripts, memos, or assets into a second manifest.
- If a source file is missing, unreadable, invalid, or has changed since an
  assessment, the dashboard must show that limitation. It must not present a
  stale cached interpretation as current.
- The project folder must remain understandable and usable without the
  dashboard.

## State entities

### Project

The project identifies the film and its root folder. It has:

- a stable project identifier and human-readable title;
- a project root;
- an intended outcome and current lifecycle stage;
- an overall derived condition: `active`, `paused`, `blocked`,
  `needs-review`, or `complete`;
- pointers to the current brief, worklist, and other workflow-defining files
  when present.

The overall condition is a summary, not a manually maintained substitute for
the underlying tasks, decisions, and artifacts. `complete` requires explicit
evidence that the finished-film delivery criterion is met; completing
pre-production alone is not project completion.

### Stage

A stage is a named part of the project lifecycle. It has entry criteria,
required outputs, exit criteria, and any required human-review gate. A
project can have one active stage and can retain prior stage outcomes.
Its state is `not-started`, `in-progress`, `blocked`, `awaiting-review`,
`passed`, `deferred`, or `cancelled`; `passed` requires recorded exit
evidence and human confirmation where the stage defines a review gate.

The lifecycle must represent the full path from script through
pre-production, production, post-production, and delivery. Detailed stage
templates may be added incrementally. An uncovered stage or missing qualified
execution role is an explicit capability gap, not an implicitly completed
stage.

Stage readiness is derived from its criteria and evidence; it is not inferred
from the percentage of tasks marked done. For the initial film workflow, the
mandatory consolidated readiness audit is the pre-production exit gate before
production begins. The workflow may show progress and run interim checks
earlier, but must not require a formal readiness audit at every stage
boundary. Later production/post-production gates can be added when those
workflows and their acceptance criteria are defined.

### Work package

A work package is a bounded, identifiable unit of work with:

- a stable ID and intended outcome;
- exactly one assigned agent or human owner at a time;
- one or more required deliverables, each with a named type and completion
  condition;
- source/evidence references;
- dependency references;
- the milestone by which its outcome is needed;
- reversibility or material-rework implications where relevant;
- current work status and review/approval state.

Work-package status is one of:

- `proposed` — identified but not authorized to start;
- `ready` — prerequisites and scope are clear and it may be started;
- `in-progress` — work has started;
- `blocked` — a specified prerequisite or capability prevents progress;
- `awaiting-review` — deliverable exists and needs review;
- `complete` — deliverable and completion condition are verified;
- `deferred` — intentionally postponed, with a revisit trigger;
- `cancelled` — intentionally stopped, with a recorded reason.

Only work packages whose dependencies are satisfied and whose scope does not
conflict may be started in parallel. The dashboard may offer parallel work;
it must not silently remove dependencies or assign multiple owners to one
package.

### Agent run

An agent run is an execution attempt for a work package, not the work package
itself. Keep its status separate:

- `queued`, `running`, `needs-input`, `idle`, `completed`, `failed`,
  `stopped`, `paused`, or `cancelled`.

Record the work-package ID, assigned agent, start/end time when available,
CLI session ID when available, last observed time, last checkpoint, produced
or changed paths, and surfaced errors. `needs-input` includes creator
questions and permission prompts; show the reason when the CLI provides it.
An `idle` or `completed` session does not by itself complete a work package,
approve an artifact, or pass a stage gate. Multiple runs may occur for one
package; prior outcomes remain traceable.

### Artifact

An artifact is a source, evidence item, decision record, analysis memo,
production-facing specification, implementation asset, or delivery item
stored in the project folder. Track:

- stable ID where the workflow supplies one, artifact class and concrete
  format/type;
- project-relative path;
- producing work package or source, where applicable;
- supporting source/evidence references;
- revision or last-observed modification information;
- observed condition: `current`, `stale`, `missing`, `unreadable`,
  `conflicting`, or `unknown`, with the evidence/reason for non-current
  conditions;
- review and approval state appropriate to its class;
- downstream work packages or stages that consume it.

The following classes are distinct:

1. **Source/evidence** — screenplay, reference, creator input, or other
   material against which claims are checked.
2. **Analysis/memo** — findings, options, or recommendations; not an approved
   production instruction.
3. **Production specification** — a structured, discipline-facing
   instruction or requirement.
4. **Implementation asset** — an executed production item such as a model,
   rig, scene, simulation, recorded performance/audio, or edit.
5. **Delivery item** — the assembled film or a required delivery component.

An artifact is not implementation-ready solely because a memo or
specification exists. Required approvals and implementation evidence must be
tracked separately.

### Decision

A decision records a creator-owned direction or an explicitly unresolved
choice. Its state is one of:

- `proposed` — suggested, not approved;
- `creator-approved` — explicitly approved by the creator;
- `unresolved` — open and not yet decided;
- `deferred` — intentionally left open, with a revisit trigger and practical
  consequence;
- `superseded` — replaced by a later decision, which must be linked.

Record the decision's scope, evidence, affected artifacts/work packages, and
the milestone by which it is needed when applicable. A proposal cannot satisfy
an approval requirement.

### Dependency and provenance links

Relationships must explain how work relates rather than merely show a flat
list. At minimum, represent:

- work package `depends-on` work package or decision;
- work package `produces` artifact;
- artifact `derived-from` source/evidence or prior artifact;
- artifact `consumed-by` work package or stage;
- decision `affects` artifact, work package, or stage;
- artifact `supersedes` or `conflicts-with` another artifact where needed.

These links are the basis for explaining why work is blocked or ready and for
showing the likely impact of a changed specification.

## Existing project files and status normalization

The dashboard must be able to read current project documents without
requiring an immediate rewrite into a new schema. It may normalize known
status wording into this contract for display, while preserving the original
file as the source. The normalized value must retain a reference to its
source text and path.

For example, a worklist status such as `next` or `before production` is a
priority/milestone hint, not proof that all dependencies are met; it must not
be mapped directly to `ready`. `done` may map to a completed-work claim that
still requires the deliverable and completion condition to be checked.
Unknown or ambiguous wording maps to `needs-review`, not to the nearest
success state. Any migration or rewrite of existing project files requires
explicit authorization and must preserve the original information.

## Review, approval, and readiness

Approval is not a single project-wide boolean. Track the applicable reviews
separately:

- creator approval of creative direction or a decision;
- creator/qualified-lead approval of a production specification;
- verification/review of an implementation asset against its specification;
- stage-exit review by the responsible human.

Use `not-required`, `not-requested`, `pending`, `approved`, `changes-requested`,
or `rejected` for each applicable review. Record who acted and when where
available. An agent cannot approve a creator-owned decision on the creator's
behalf.

The mandatory pre-production exit audit must report:

- required artifacts missing, stale, unreadable, or in conflict;
- unresolved or deferred decisions that block the stage, and the reason;
- unmet dependencies and their owners;
- required reviews/approvals still pending;
- missing execution capability or qualified ownership;
- proposed next actions and the evidence supporting each.

The audit can be automated, including by a final dashboard/readiness agent
pass over project files, but it is not an automatic authorization. It
confirms whether production has the correct current information and assets to
continue, identifies gaps and their downstream impact, and reports the basis
for each conclusion. A designated human reviews the findings and confirms or
declines the transition into production. Do not label production `ready`
while a required condition is unmet; do not hide non-blocking deferrals that
have valid revisit triggers. During earlier work, interim checks may surface
the same issues without creating additional mandatory gates.

## Change impact and parallel work

When a source, decision, or specification changes, the dashboard must use
provenance and dependency links to identify potentially affected artifacts,
work packages, and stages. It should show the reason for each impact and
whether re-review or rework may be needed.

An impact report is advisory until a responsible human confirms affected
items. The system must not silently rewrite downstream files, revoke an
approval, or claim an artifact is stale without recording the changed
evidence and basis for that status. Where impact cannot be determined, show
`impact-unknown` and require review rather than asserting no impact.

Parallel execution is allowed only for independently ready work packages.
The dashboard must make active runs, changed files, dependencies, and possible
overlap visible. Conflicting edits require human resolution; parallel agent
completion does not resolve creative or technical conflicts automatically.

## Required invariants

1. The project folder is sufficient to reconstruct durable workflow state.
2. The dashboard is a view/controller over that state, not a second authority.
3. Work-package status, agent-run status, artifact status, approval state,
   decision state, and stage readiness are separate.
4. Every completion and readiness claim links to evidence.
5. Missing, stale, partial, conflicting, and unknown information is visible
   and never converted into success-shaped defaults.
6. A recommendation is not a decision; a memo is not a production
   specification; a specification is not an implemented asset.
7. No agent run can autonomously approve creator-owned decisions or authorize
   a stage transition.
8. The dashboard can explain blockers and change impact from explicit
   relationships, and reports uncertainty when those relationships are
   insufficient.

## Review walkthrough

Review this contract against the pilot film project before accepting it:

- Can the existing brief distinguish approved direction, proposals,
  unresolved choices, and deferrals?
- Can every worklist row identify its one owner, dependencies, deliverable,
  status, and whether it can run alongside other packages?
- Can the current specialist memos be represented without treating them as
  approved production assets?
- Can a changed creator decision identify which specifications need
  re-review?
- Can a consolidated pre-production readiness pass identify missing, stale,
  conflicting, or unapproved inputs before production begins, while leaving
  the actual stage-transition approval to a human?
- Can the complete-film goal remain visible when later-stage workflow
  definitions or qualified executors do not yet exist?

## Decisions intentionally left for later

- File format and exact on-disk schema for any structured workflow records.
- Exact stage catalog and stage-specific required-artifact templates.
- How external agent platforms are invoked and what their actual permission
  boundaries are.
- Which reminders or unattended operations are feasible.
- Dashboard framework, packaging, deployment, and optional cache/index
  implementation.

These belong in the user-journey and architecture work, not as assumptions in
this state contract.
