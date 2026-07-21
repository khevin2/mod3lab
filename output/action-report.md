# Prioritized Customer-Support Action Report

- Dataset version: synthetic-support-v1
- Workflow version: 1.0
- Total tickets: 10

This report formats the validated Stage 1 classifications without changing them.

## Counts by priority

| Priority | Count |
| --- | ---: |
| critical | 1 |
| high | 3 |
| medium | 3 |
| low | 3 |

## Counts by category

| Category | Count |
| --- | ---: |
| account_access | 1 |
| billing | 3 |
| feature_request | 2 |
| service_outage | 1 |
| technical | 2 |
| other | 1 |

## Priority-ordered tickets

| Priority | Ticket ID | Category | Sentiment | Summary | Recommended action | Needs clarification |
| --- | --- | --- | --- | --- | --- | --- |
| critical | TKT-005 | service_outage | negative | All 35 agents in a production workspace receive 503 errors after sign-in, stopping the entire team's work. | Escalate as a production incident, investigate the workspace-wide 503 errors immediately, and verify whether the public status page needs updating. | false |
| high | TKT-001 | billing | negative | Customer reports two $49 charges for the same monthly subscription and requests reversal of the duplicate. | Review the subscription billing records, confirm whether the two $49 charges are duplicates, and reverse the duplicate charge if verified. | false |
| high | TKT-002 | account_access | negative | Customer cannot sign in because multiple password-reset requests have not produced a reset email. | Investigate password-reset email delivery, verify whether the requests were generated, and help restore account access. | false |
| high | TKT-008 | billing | negative | Customer was charged again after support confirmed cancellation and requests a refund and prevention of future charges. | Verify the confirmed cancellation, stop any active recurring billing, and refund the post-cancellation charge if validated. | false |
| medium | TKT-003 | technical | negative | After the latest app update, the mobile app closes when uploading JPG files larger than 5 MB; desktop upload still works. | Reproduce the issue on the updated mobile app with a JPG larger than 5 MB, investigate the crash, and note the desktop-site workaround. | false |
| medium | TKT-007 | technical | negative | The analytics dashboard intermittently times out and takes about a minute per attempt, though retrying usually succeeds. | Investigate intermittent dashboard timeouts and slow load times, using the reported repeated occurrences and successful retry behavior. | false |
| medium | TKT-010 | other | negative | Customer reports that something is not working but provides no affected feature, symptoms, or context. | Ask which feature or task is failing, what happened, what was expected, any error message, reproduction steps, and the device or environment used. | true |
| low | TKT-004 | feature_request | neutral | Customer requests a dark mode to make the interface easier to use at night; existing functionality works. | Record and route the dark-mode request to the product team for consideration. | false |
| low | TKT-006 | billing | neutral | Customer can see last month's invoice number but cannot find a way to download the invoice as a PDF. | Provide the correct steps or location for downloading the invoice PDF, or investigate why the export option is unavailable. | false |
| low | TKT-009 | feature_request | positive | Customer praises the new dashboard and suggests a weekly email digest containing the same metrics. | Record and route the weekly metrics email-digest suggestion to the product team for consideration. | false |

## Clarification needed

### TKT-010

- Summary: Customer reports that something is not working but provides no affected feature, symptoms, or context.
- Recommended action: Ask which feature or task is failing, what happened, what was expected, any error message, reproduction steps, and the device or environment used.
- Information gaps:
  - Affected feature or task
  - Observed behavior and expected behavior
  - Error message or visible symptoms
  - Steps to reproduce the issue
  - Device, application, or browser environment
