## 1. Persistent checkpoints and resume

- **Depends on:** workflow-model/1, workflow-model/3, dashboard/1
- **Contract:**
  - **In:** A project/work-package state and a user-started operation or
    workflow session.
  - **Requires:** Approved storage and lifecycle design; explicit identity
    for project, task, session/operation, and checkpoint.
  - **Delivers:** Durable checkpoint and resume contract plus an initial
    implementation or proof of feasibility, as specified by the architecture
    decision. A user can recover the last known state and continue manually.
- **Pre-work:** Architecture decision accepted; define data-retention and
  access rules.
- **Out of scope:** Indefinite execution; storing full private conversations
  by default; making creative decisions; claiming lost in-memory context can
  always be reconstructed.
- **Acceptance checks:**
  - Interrupted and restarted work reports last confirmed checkpoint and
    remaining steps.
  - Checkpoints preserve artifact type, source/evidence links, approval
    state, and any downstream implementation dependency; they do not promote
    a memo or proposal into an approved specification or completed asset.
  - Partial writes, duplicate resume attempts, and stale state are detected
    and surfaced.
  - The user can pause, cancel, and manually resume.
  - Sensitive data stored in checkpoints is minimized and documented.
- **Tests:** Simulated interruption/restart, stale checkpoint, duplicate
  resume, and unauthorized access cases.
