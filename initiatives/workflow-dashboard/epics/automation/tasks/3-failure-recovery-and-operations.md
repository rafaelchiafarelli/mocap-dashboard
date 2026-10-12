## 3. Failure recovery and operations

- **Depends on:** automation/1 and automation/2
- **Contract:**
  - **In:** Implemented checkpoint and reminder/hook behavior.
  - **Requires:** Defined logs, error states, user permissions, and recovery
    steps.
  - **Delivers:** An operator runbook and observable recovery behavior for
    failed, stuck, duplicated, expired, or unauthorized operations.
- **Pre-work:** Automation tasks 1 and 2 implemented in a test environment.
- **Out of scope:** Production deployment or service-level guarantees not
  approved by the project owner.
- **Acceptance checks:**
  - Each operation exposes status, start/last update time, owner, checkpoint,
    failure cause, and supported recovery action.
  - Recovery and retry operations preserve artifact type and approval state
    and cannot turn partial planning output into a success-shaped
    implementation-complete state.
  - Users can stop or disable automation without corrupting project data.
  - Retention, backup, restore, and deletion behavior is documented.
  - An operator unfamiliar with implementation can recover a test project
    using the runbook.
- **Tests:** Failure-injection/recovery exercise and second-user runbook
  walkthrough.
