## 1. Workflow state contract

- **Depends on:** —
- **Contract:**
  - **In:** Current workhorse agents and documentation; representative
    project artifacts such as readiness report, session plan, creative brief,
    and production worklist.
  - **Requires:** Read-only examination of the current workflow. Do not
    modify any film project's state or assume a specific film.
  - **Delivers:** `spec/workflow-state-contract.md` defining the minimum
    project, stage, artifact, decision, work-package, assignment, dependency,
    review, and handoff fields and their allowed states. Artifacts must
    distinguish analysis/memo, structured production specification, and
    implementation asset, with required format/type, evidence references,
    approval state, and producer/owner where known. Decision records must
    distinguish must-decide-before-next-milestone from safely-deferred
    choices and include a revisit trigger and consequence for deferrals.
- **Pre-work:** Inventory the current workflow stages and project artifacts.
- **Out of scope:** Selecting a database/framework; implementing a dashboard
  or hooks; inventing project decisions.
- **Acceptance checks:**
  - The lifecycle represents project stages and their criteria; the initial
    workflow defines one mandatory consolidated readiness audit before
    production begins. Earlier interim checks may be surfaced, but formal
    readiness gates at every stage boundary are not required.
  - Each work package has exactly one assigned agent, a stable ID, dependency
    references, a concrete deliverable type and contract, completion
    condition, and status.
  - A memo, specification, and implementation asset are distinct artifact
    classes; completion of one never silently satisfies another.
  - Creative approval, technical/production specification approval, and
    implementation readiness are represented separately. Unapproved
    proposals cannot be consumed as final implementation requirements.
  - If no qualified execution agent or human role is assigned, implementation
    readiness is blocked or explicitly marked as a capability gap, not
    treated as ready because a planning agent produced a document.
  - Creator-approved, tentative, unresolved, and deferred decisions are
    distinct states and are never silently interchangeable.
  - Work packages can record reversibility/rework impact and the milestone by
    which a choice is actually required, so unknowns do not automatically
    become blockers or new tasks.
  - Deferred decisions have a revisit trigger; the contract does not require
    every deferral to become a work package.
  - Missing, stale, partial, or conflicting artifacts can be represented
    without being reported as complete.
  - A future collaborator can determine the next valid action from the
    project records without relying on tacit creator knowledge.
- **Tests:** Creator review against the current readiness, session-plan,
  creative-brief, and production-worklist formats; fixture review for
  missing, stale, partial, and conflicting inputs.
