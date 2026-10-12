## 2. User journeys and automation policy

- **Depends on:** workflow-model/1
- **Contract:**
  - **In:** `spec/workflow-state-contract.md` and the current agent workflow.
  - **Requires:** Review of film start, analysis, multi-session section
    work, consolidation, creator interview, worklist execution, transition
    from analysis to structured production specification to approved
    implementation, handoff, pause, resume, and collaborator onboarding.
  - **Delivers:** `spec/user-journeys-and-automation-policy.md` describing
    user journeys, role/approval boundaries, agent dispatch/monitoring,
    bounded creator-decision prompts, deferral/revisit behavior,
    interruption/recovery, and observable safety requirements.
- **Pre-work:** Task 1 accepted by the initiative owner.
- **Out of scope:** Selecting a notification provider; implementing hooks,
  daemons, job queues, or UI; allowing agents to make creative decisions
  unattended.
- **Acceptance checks:**
  - Every journey identifies its user, starting condition, action, resulting
    state, handoff, and recovery path.
  - The policy distinguishes a durable film-local checkpoint from a
    continuously running AI session; it does not imply that editor sessions
    or models stay available indefinitely.
  - Agent dispatch is explicitly user-authorized in the supported agent
    interface; session status tracking is read-only, bounded, and has a
    manual fallback.
  - No long-running or scheduled behavior is required in the creator-only
    MVP. Any later scheduled operation is opt-in, visible, bounded, resumable,
    and cancelable, with errors surfaced rather than hidden.
  - Creative approvals, source edits, destructive changes, and external
    notifications have explicit authorization requirements.
  - A specialist may only produce deliverables within its assigned task and
    remit. Cross-discipline dependencies become explicit handoffs or separate
    tasks; they do not authorize a specialist to expand scope.
  - A specialist decision gate is limited to three task-scoped questions,
    one at a time; a full creator interview is limited to five must-decide
    questions per pass unless the creator asks to continue.
  - Questions are prioritized by next-milestone impact and reversibility.
    Decisions that can be handled in editing or by a targeted reshoot are
    deferred by default unless evidence shows material risk.
  - Deferred items record a revisit trigger and consequence. Non-blocking
    deferrals are grouped in a register and do not each create a work package.
  - Option sets avoid combinatorial alternatives: normally one grounded
    recommendation and no more than one materially distinct alternative.
  - Automation cannot convert a memo or proposal into an approved
    specification or implementation asset, or mark an asset implemented
    without verifiable evidence.
  - Manual operation remains possible when CLI monitoring, a model, network,
    or notification service is unavailable.
- **Tests:** Creator walkthrough of normal, paused, interrupted, failed, and
  handed-off scenarios. Document future collaborator onboarding separately;
  a second-user acceptance test is post-MVP.
