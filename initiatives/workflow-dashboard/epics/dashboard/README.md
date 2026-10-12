# dashboard

**Goal:** Give creators and collaborators an approachable place to start a
project and see its current workflow state, artifacts, pending decisions,
work packages, and next actions.

**Depends on:** workflow-model epic.

**MVP gate:** The creator can start or open a project, understand current
progress and blockers, find source/handoff files, and determine what can
safely happen next. The dashboard distinguishes narrative memos,
production-facing specifications, and implementation assets, and shows
their approval states. It does not imply that a task or decision is complete
without evidence in the state contract.

The data and guidance should be understandable to a future collaborator.
Multi-user accounts, shared access control, simultaneous human editing, and a
second-user acceptance test are post-MVP.

## Task order

1. `1-project-onboarding-and-status-view.md`
2. `2-work-package-board-and-handoffs.md` — depends on task 1
3. `3-collaborator-guide-and-recovery.md` — depends on tasks 1 and 2
