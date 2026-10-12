## 2. Work-package board and handoffs

- **Depends on:** dashboard/1 and workflow-model/1
- **Contract:**
  - **In:** A project with a parsed or explicitly entered production worklist.
  - **Requires:** Stable task IDs, one assigned agent per task, dependency
    links, statuses, concrete deliverable contracts and types, and the
    approval distinctions in the workflow-state contract. Decision items
    also carry milestone, reversibility/rework impact, and deferral trigger.
  - **Delivers:** A task/work-package view that identifies ready, blocked,
    deferred, in-progress, and completed work, links handoff files, and gives
    a copyable handoff for the assigned agent. When available, it also shows
    the linked, read-only Claude Code session status.
- **Pre-work:** State contract and onboarding/status view accepted.
- **Out of scope:** Running the agent without user initiation; treating
  narrative claims as verified status without artifact evidence.
- **Acceptance checks:**
  - Exactly one assigned agent is shown for each work package.
  - A task is shown as ready only when its declared dependencies and review
    gates are satisfied.
  - Users can distinguish agent output awaiting creator approval from
    approved project direction.
  - The task view presents its source files, concrete output format,
    completion test, approval state, implementation/execution dependency,
    and resume context.
  - When a task's deliverable is an implementation asset, the board requires
    an approved upstream specification and identifies the qualified executor;
    it flags a missing executor rather than suggesting a planning agent
    create the asset.
  - Cross-discipline implications are visible as links/dependencies, not
    added responsibilities for the currently assigned specialist.
  - The board groups safely deferred decisions by revisit milestone instead
    of displaying each as a blocking task; it exposes the reason and trigger.
  - The handoff prompt tells the specialist to ask no more than three
    task-scoped questions, one at a time, and to avoid option combinations.
  - The creator dispatches sessions in Claude Code; the dashboard cannot
    silently launch runs, bypass permissions, or claim task completion from
    session completion.
  - Parallel work is offered only when dependencies and declared write paths
    permit it. Overlapping or unknown write scopes require serial work or
    explicit human review.
- **Tests:** Fixture-based status/dependency tests and a collaborator
  handoff walkthrough.
