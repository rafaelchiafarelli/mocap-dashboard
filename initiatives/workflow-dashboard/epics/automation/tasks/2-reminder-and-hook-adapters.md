## 2. Reminder and hook adapters

- **Depends on:** automation/1, workflow-model/2, workflow-model/3
- **Contract:**
  - **In:** Durable checkpoints, user-approved notification policy, and the
    supported hook/event APIs selected in the architecture decision.
  - **Requires:** User opt-in, configured target, bounded retry/frequency,
    visible logs, and a disable path.
  - **Delivers:** One or more documented, tested reminder or automation
    adapters that notify a user of a resumable next action without implying
    that a model or editor is continuously active.
- **Pre-work:** Verify provider API support and limitations from authoritative
  sources; no credentials or external account access assumed.
- **Out of scope:** Unapproved email/SMS/push; unattended creative decisions;
  unsafe shell commands; always-on service deployment without an explicit
  operational decision.
- **Acceptance checks:**
  - Reminders are opt-in, bounded, cancelable, and identify their film,
    task, last checkpoint, and next action without leaking unrelated
    film content.
  - Failures are visible and do not produce success-shaped status.
  - The feature degrades to manual resume when the adapter/provider is
    unavailable.
  - No event or hook can approve a creative decision or silently mark work
    done.
  - No reminder or hook may infer that a downstream implementation asset
    exists from completion of a memo or structured specification.
- **Tests:** Mocked adapter tests for success, duplicate event, rate limit,
  provider failure, cancellation, and disabled configuration.
