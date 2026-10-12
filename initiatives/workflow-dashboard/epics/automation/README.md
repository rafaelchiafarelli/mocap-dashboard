# automation

**Goal:** Make interrupted or long-running pre-production workflows
recoverable and visible, using reminders or supported automation hooks where
safe and feasible.

**Depends on:** workflow-model epic and dashboard project/task identifiers.

**Safety boundary:** “Long-running” means durable state, resumable work,
bounded background operations, or reminders—not a promise that an AI chat,
model, remote editor, or user session remains alive indefinitely. No
unattended creative approval, source rewrite, destructive action, or external
notification without explicit authorization. Automation must preserve the
distinction between analysis memos, approved production specifications, and
implementation assets; completing one artifact must never imply another
exists or is approved.

**Epic gate:** Users can see an operation's status, last checkpoint, owner,
next action, errors, and cancellation/recovery behavior. Manual resume remains
available when automation is unavailable.

## Task order

1. `1-persistent-checkpoints-and-resume.md`
2. `2-reminder-and-hook-adapters.md` — depends on task 1 and the architecture
   decision
3. `3-failure-recovery-and-operations.md` — depends on tasks 1 and 2
