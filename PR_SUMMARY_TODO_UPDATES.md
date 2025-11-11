 # SRS To-Do List — Additions & Expanded Items

## Summary

This PR prepares the SRS (`LifePilot_SRS.md`) updates that add a new "11. To-Do List" section and expands high-priority TODOs with milestones, acceptance criteria, and ETAs. The goal is to make the SRS action-oriented so teams can pick up work and track progress.

## Files changed (local)

- `LifePilot_SRS.md` — added `## 11. To-Do List` with TODO-001 through TODO-026. High-priority items were expanded with Milestones, Acceptance criteria and ETAs.

## What changed

- Inserted a comprehensive To-Do List into the SRS.
- Expanded the following high-priority TODOs to be actionable:
  - TODO-001 (analytics), TODO-002 (API spec), TODO-004 (sync/conflict), TODO-005 (privacy policy),
    TODO-006 (accessibility), TODO-010 (data export/deletion), TODO-012 (release), TODO-013 (security threat model).

## Why

Making TODOs actionable reduces back-and-forth and accelerates execution. Each expanded item includes a milestone, acceptance criteria, and an ETA to help planning and scoping.

## Requested reviewers

- Product (confirm priorities and ETAs)
- Backend (API spec, sync, export/deletion)
- Security (threat model)
- Legal (privacy policy)
- UX/QA (accessibility checklist and onboarding)

## Next steps for reviewers

1. Confirm or adjust owners and ETAs for each TODO.
2. Prioritize the TODOs against roadmap/quarter goals.
3. Create implementation tickets in your tracker (GitHub issues, JIRA, etc.) and link them from the SRS.

## How to open a PR locally

1. Create and switch to a branch:

   git checkout -b chore/srs/todo-pr

2. Commit the updated `LifePilot_SRS.md` and this `PR_SUMMARY_TODO_UPDATES.md` file.

3. Push the branch and open a PR via your usual flow (GitHub web or `gh` CLI).

## Notes

- This summary is intentionally concise — if you want, I can expand it into a full PR body with a checklist of files changed and suggested issue templates for the highest-priority TODOs.

## Suggested action for me

- I can (a) expand remaining TODOs with milestones/ETAs, (b) convert high-priority TODOs into GitHub issues, or (c) prepare a formal PR body and open the PR (requires permission to push/create PRs remotely).

End of PR summary
