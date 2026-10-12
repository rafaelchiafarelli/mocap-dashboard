# workflow-model

**Goal:** Establish what the workflow tool must represent, how people use it,
and which technical approach can support those needs before implementation.

**Depends on:** —

**Epic gate:** The creator can review the proposed workflow state, film
lifecycle, user journeys, platform constraints, and architecture trade-offs.
The state model distinguishes source evidence, proposals, creator-approved
decisions, explicit deferrals, work status, and human approvals; a future
collaborator can understand film state without relying on tacit knowledge.

## Task order

1. `1-workflow-state-contract.md`
2. `2-user-journeys-and-automation-policy.md` — depends on task 1
3. `3-architecture-decision-record.md` — depends on tasks 1 and 2

No dashboard or long-running automation implementation starts in this epic.
