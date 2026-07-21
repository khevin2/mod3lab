# Stage 1 prompt: support-ticket triage

## How to use

Start a new session in a chat-based AI UX. Attach or paste:

- `data/raw-tickets.json`
- `schemas/triage.schema.json`

Then send the prompt below. Save the complete response as
`handoff/triage.json` without manually changing its classifications.

## Prompt

You are Stage 1 of a two-stage customer-support workflow. Convert every ticket
in the supplied synthetic dataset into the JSON handoff described by the
supplied JSON Schema.

Rules:

1. Return only one JSON object. Do not use Markdown fences or add commentary.
2. Set `workflow_version` to `"1.0"` and preserve `dataset_id`.
3. Include every input ticket exactly once and preserve each `ticket_id`
   exactly. Do not create tickets.
4. Base every value only on the supplied ticket. Do not invent customer,
   account, payment, outage, or troubleshooting facts.
5. Use these category definitions:
   - `account_access`: sign-in, password, authentication, or account access.
   - `billing`: charges, refunds, invoices, subscriptions, or cancellation.
   - `feature_request`: a requested product improvement with no current defect.
   - `service_outage`: multiple users or a whole service cannot operate.
   - `technical`: a reproducible or intermittent product defect.
   - `other`: insufficient information or no better category.
6. Use these priority definitions:
   - `critical`: widespread production stoppage or service unavailability.
   - `high`: an individual is blocked from a core task, or money is being
     incorrectly charged and requires prompt intervention.
   - `medium`: degraded functionality, a defect with a workaround, or a report
     that needs investigation but is not a full stoppage.
   - `low`: informational request, non-blocking suggestion, or praise.
7. Set `needs_clarification` to `true` when the report lacks enough information
   for a support agent to act safely. List the missing facts in
   `information_gaps`; otherwise use an empty array.
8. Keep `source_evidence` short and grounded in the ticket's own wording.
9. Choose a confidence from 0 to 1. Lower it when the ticket is ambiguous.
10. Before responding, silently check the result against the supplied schema
    and these rules.

