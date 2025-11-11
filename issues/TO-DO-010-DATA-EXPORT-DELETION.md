Title: TODO-010 — Data export & deletion workflow implementation

Description
-----------
Implement end-to-end flow for user-initiated export and GDPR/CCPA-compliant deletion with audit logs and admin tooling.

Milestone
---------
Implement export endpoints and irreversible deletion workflow with audit trails and admin tools.

Acceptance criteria
-------------------
- Users can request and download a complete data export in standard formats (JSON/CSV).
- Deletion requests remove all user data from active storage and create a verifiable audit record.
- Tests verifying exports and deletions across staging data sets.

ETA: 3 weeks

Assignees: @backend-team, @security-team
Labels: data-governance, privacy, priority/high
