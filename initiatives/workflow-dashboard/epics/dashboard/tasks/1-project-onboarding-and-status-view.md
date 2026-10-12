## 1. Project onboarding and status view

- **Depends on:** workflow-model/1 and workflow-model/3
- **Contract:**
  - **In:** Project root selected by an authorized user and the approved
    workflow-state and architecture contracts.
  - **Requires:** Explicit project identity and location; a safe way to
    inspect existing artifacts without overwriting them.
  - **Delivers:** A usable project-start flow and overview showing project
    identity, workflow stage, expected artifacts, observed artifact status
    and type (memo, structured specification, or implementation asset),
    approval state, and next stage gate.
- **Pre-work:** Architecture decision accepted; sample project fixtures
  covering empty, partial, complete, conflicting, and unreadable states.
- **Out of scope:** Generating creative decisions; silently creating or
  overwriting source documents; task-agent orchestration.
- **Acceptance checks:**
  - A new project can be initialized without embedding a project-specific
    path in reusable configuration.
  - Existing projects can be opened in read-only/discovery mode before any
    state migration or write.
  - Missing, unreadable, stale, and conflicting files are visibly distinct
    from completed artifacts.
  - The overview never presents a narrative memo as a completed
    production-facing specification or a specification as an implemented
    asset.
  - The view links users to the workflow explanation and next valid action.
- **Tests:** Automated checks for project discovery and state rendering;
  manual onboarding by a collaborator unfamiliar with the workflow.
