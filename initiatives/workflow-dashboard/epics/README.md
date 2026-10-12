# workflow-dashboard — epics (execution order)

1. **workflow-model** — workflow lifecycle, data contract, user journeys, and
   architecture decisions.
2. **dashboard** — film onboarding, workflow status, work package
   visibility, and multi-person handoff.
3. **automation** — durable resume state, long-running process support,
   reminders, and supported automation-hook adapters.

`dashboard` depends on the state and architecture contracts from
`workflow-model`. `automation` depends on the architecture and event/state
contracts from `workflow-model`, plus the dashboard's film and work-package
identifiers. Do not implement automation against an unstable state model.

The workflow model must distinguish narrative analysis, structured
production-facing specifications, and implementation assets, including their
separate approval and completion states. Dashboard tasks must expose these
distinctions; automation must never imply that one artifact class substitutes
for another. If the current specialist roster has no qualified executor for
an asset type, show the capability gap rather than delegating implementation
to an analyst.

An epic is ready to close only when its tasks and stated acceptance checks
are complete and the result has been reviewed against the initiative gate.
