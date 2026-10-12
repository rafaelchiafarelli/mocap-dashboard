# workflow-dashboard — mocap-dashboard

**Goal:** Create a reusable dashboard and workflow-support tool that helps a
creator take a film from source material through pre-production, production,
post-production, and delivery. Make current work, evidence, dependencies,
decisions, approvals, agent activity, and next actions visible, and explain
why the project is in its current state and what a changed requirement may
affect.

**Problem:** The current workflow is described across custom agents and
project-specific files. A creator must remember which agent to run, which
files to provide, what stage is complete, which work packages can run in
parallel, what evidence supports each status, what decisions need approval,
and how a changed requirement affects downstream work.

**Users:** The creator in the initial local MVP; authorized collaborators
may be added after the single-user workflow and access boundaries are proven.

## MVP scope

- Creator-only, local-first pilot using a real film project as the acceptance
  case. Design records so a future collaborator can understand them, but do
  not require accounts, hosted collaboration, or remote storage in the MVP.
- Represent the full film lifecycle through final delivery. Stage templates
  and qualified roles may be marked unconfigured until production planning
  defines them; never represent an undefined stage as complete.
- Support creator-dispatched Claude Code sessions using copyable task
  handoffs and documented read-only session-status monitoring. Do not require
  Anthropic API-key billing or unattended dispatch.

- Make the workflow discoverable and usable without relying on the creator to
  remember its sequence.
- Support starting/opening a project from a selected project root and tracking its
  workflow stage, required artifacts, work packages, dependencies, assigned
  specialist agent, status, required output type, approval state, and next
  action.
- Make the distinction between analysis memos, structured
  production-facing specifications, and implementation assets explicit and
  traceable through handoffs. A task cannot be considered implementation-ready
  merely because a memo exists.
- Keep decision-making bounded: surface only choices that affect the next
  milestone or carry material rework risk; track safe-to-defer choices with a
  revisit trigger rather than allowing open questions to grow the worklist
  without limit.
- Make session handoffs and long pauses recoverable: show what was last
  completed, what remains, what decisions are open, and how to resume.
- Show dependencies and likely downstream impact when a source, decision, or
  specification changes; identify unknown impact rather than claiming none.
- Assess and, if a safe and supported design is established, implement
  automation hooks or reminders that can keep a process alive or bring it
  back to attention over a long period.
- Keep future human ownership, review, and approval visible in the data model;
  multi-user access control and shared editing are post-MVP.
- Keep project-specific materials in each film project's root and the
  reusable dashboard/workflow definitions in this workhorse.

## Out of scope

- Making creative decisions, approving a brief, or granting production
  readiness automatically.
- Allowing unattended agents to make irreversible creative choices, rewrite
  the screenplay, create final assets, or represent unreviewed work as
  approved.
- Treating planning specialists as implementation agents. Specifications
  (such as shot lists, prop/material registers, lighting instructions, or
  cloth behavior criteria) are distinct from implementation assets (such as
  Blender scenes, rigs, simulations, mocap JSON, or recorded audio).
- Assuming that a model, editor, machine, or network connection will remain
  available indefinitely.
- Choosing a specific dashboard framework, database, hosting model,
  notification provider, or agent platform before the architecture task
  evaluates the requirements and trade-offs.
- Replacing the specialist agents or the project's source materials.

## Initiative gate

The initiative is complete when a representative user can:

1. Start or open a film workflow from a project root using clear onboarding.
2. See the current stage, required and completed artifacts, open decisions,
   work packages, their single assigned agent, named deliverable type,
   dependencies, approval state, and next available action.
3. Pause and resume after a long interval without losing workflow state or
   confusing proposals with creator-approved decisions. Future collaborator
   handoff must remain feasible but is not required for the MVP.
4. Trace a production-facing specification to its evidence and approval,
   then identify a separate qualified execution task or explicitly show that
   no execution agent is available. Do not present specification completion
   as asset implementation.
5. Distinguish must-decide-now items from safely reversible/deferred items;
   keep decision prompts and new work packages bounded, with explicit
   revisit triggers for deferred choices.
6. Observe creator-dispatched parallel agent sessions where the documented
   CLI status interface is available; retain manual handoff/status fallback.
   Any future unattended automation requires visible status, durable
   checkpoints, explicit pause/cancel/recovery behavior, and clear
   human-approval gates.
7. Understand how to operate the workflow from built-in guidance without
   relying on the original creator's memory.

The MVP gate requires documented evaluation of the intended editor/agent
environment, access boundaries, project-local persistence, and recovery. It
also requires a consolidated pre-production readiness audit before the
creator authorizes production entry. Interim checks may be shown without
adding mandatory stage gates. Production/post-production definitions and
required software must be surfaced as gaps until established. Notification
providers, unattended scheduled runs, and shared backup/access are later
decisions.

## Epic execution order

1. **workflow-model** — review the lifecycle/state contract, creator journey,
   source-of-truth model, Claude Code integration boundary, and architecture.
2. **dashboard** — implement project discovery, lifecycle/progress views,
   dependency/change-impact view, and work-package handoffs/session tracking.
3. **automation** — implement durable checkpoints and supported pause/resume
   behavior. Reminders, hooks, and unattended operations remain later scope
   until feasibility and authorization are established.

## Lessons from the pilot film

The first film taken through the pre-production agents (the pilot, kept
outside this repository) showed these things. The contracts in `spec/` are
written to answer them.

1. **Unbounded interviews and option menus stall the creator.** The agents
   now cap questions (facilitator ≤ 5 per pass, specialist ≤ 3 per task, one
   at a time) and offer one recommendation plus at most one real alternative.
   The dashboard must show deferred decisions with a revisit trigger, not
   turn each one into a blocker or a new work package.
2. **Choices that editing or a targeted reshoot can fix are not blockers.**
   The creator accepted that recovery path explicitly. Classify each item as
   decide now, decide before the next milestone, or defer to edit/reshoot.
3. **"Done" and "approved" got mixed in free text.** Worklist statuses read
   like `done — creator accepted`, `done — proposals pending review`,
   `awaiting bounded creator review`. Completion of a deliverable and the
   creator's approval of it are separate fields, and the parser must reject
   ambiguous rows instead of guessing.
4. **Planning memos are easy to mistake for production assets.** Keep memo,
   specification and implementation asset as separate classes with separate
   approval. When no executor exists for an asset type, show the gap.
5. **Specialists drift into each other's disciplines.** Each work package has
   exactly one owning agent. Cross-discipline needs are dependencies or
   handoffs, never shared ownership.
6. **Creator clarifications arrive mid-stream.** In the pilot, a motif became
   central only after the first visual memo, and that produced a supplementary
   specification task. Decisions need IDs and explicit links to the work that
   depends on them, so the dashboard can show what a change affects.
7. **A project folder without version control loses history.** The pilot's
   worklist recorded "commit unavailable" against delivered work. The
   dashboard must work on non-git projects, but there it forbids parallel
   writes to shared files and says that rollback is unavailable.

See `epics/README.md` for dependency and acceptance order. Each task file
defines one deliverable contract. Do not start implementation until its
contract, dependencies, pre-work, and tests or acceptance checks are clear.
