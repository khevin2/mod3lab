# Testing

I used Node.js's built-in test runner to verify the deterministic part of the
workflow. On 2026-07-21, `npm test` passed all 10 tests.

## Cases I tested

| Test case | Expected result |
| --- | --- |
| Valid handoff | Generates the complete report deterministically |
| Missing required schema property | Rejected with a field-specific error |
| Missing source ticket ID | Rejected |
| Duplicate ticket ID | Rejected |
| Invented ticket ID | Rejected |
| Dataset ID mismatch | Rejected |
| Clarification is true with no information gaps | Rejected |
| Clarification is false with information gaps | Rejected |
| Empty ticket list | Rejected by the schema |
| Invalid CLI input | Returns exit status 1 and writes no report |

## Report behavior I verified

- Identical input generates identical output.
- The report includes the dataset and workflow versions.
- The report contains all 10 tickets.
- Tickets appear in `critical`, `high`, `medium`, then `low` order.
- The report includes priority and category counts.
- `TKT-010` appears in the clarification-needed section.

The exact command output is stored in `evidence/test-results.txt`, and the test
run is also visible in `evidence/screenshots/vs-code-complete-tests.png`.

