## 3. Architecture decision record

- **Depends on:** workflow-model/1 and workflow-model/2
- **Contract:**
  - **In:** Accepted workflow state and user-journey/automation contracts.
  - **Requires:** Evaluation of the actual target environments, including
    Remote VS Code/WSL2, Claude Code subscription authentication and
    documented agent-session monitoring, film-root access, future
    collaborator handoff, persistence, security, and operating/maintenance
    cost.
  - **Delivers:** `spec/architecture-decision-record.md` comparing viable
    dashboard, persistence, integration, and automation approaches; chosen
    approach (or explicit unresolved decisions); deployment and migration
    boundaries; contracts for dashboard and automation epics; and a
    feasibility assessment of how agent/workspace write permissions can be
    enforced versus merely documented.
- **Pre-work:** Tasks 1 and 2 reviewed; verify supported platform capabilities
  from authoritative documentation before depending on them.
- **Out of scope:** Implementing the selected architecture; assuming a cloud
  service, database, hook API, or always-on machine without explicit
  evaluation.
- **Acceptance checks:**
  - At least one viable minimum approach and its limitations are documented,
    including the decision not to require Anthropic API-key billing in the
    initial creator-only MVP.
  - Platform-specific capabilities and gaps are separated from
    platform-neutral workflow data.
  - The design defines ownership, persistence, backup/export, access control,
    failure reporting, and recovery.
  - The design states exactly what can run unattended and what always needs
    human confirmation.
  - The design distinguishes prompt-level scope guidance from technically
    enforceable file/tool permissions. It documents the actual enforcement
    boundary and does not describe agent instructions as hard access control.
  - The design addresses how structured specs, approval state, and
    implementation artifacts are linked and how missing execution capability
    is surfaced.
  - Dashboard and automation task contracts can be written without relying
    on unstated architecture decisions.
- **Tests:** Architecture review against both prior contracts and a
  documented feasibility walkthrough in the intended remote environment.
