Title: TODO-004 — Offline sync edge cases & conflict resolution flows

Description
-----------
Document conflict scenarios, UI merge patterns, and tests for last-writer-wins and user-merge. Decide between CRDTs and LWW for each data type.

Milestone
---------
Publish sync design doc describing conflict model, CRDT vs LWW decisions, and UI merge patterns.

Acceptance criteria
-------------------
- Sync spec reviewed with sample conflict scenarios and UX for user-assisted merges.
- Unit and integration tests covering common conflict types and offline->online reconciliation.

ETA: 3 weeks

Assignees: @backend-team, @mobile-team
Labels: sync, conflict-resolution, priority/high
