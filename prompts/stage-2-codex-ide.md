# Stage 2 prompt: implement the report workflow

## How to use

Open this repository in Visual Studio Code with the Codex IDE extension. Ensure
that `handoff/triage.json` contains the unedited output from Stage 1 and that
the evidence of Stage 1 has been saved. Send the prompt below to Codex in the
IDE.

## Prompt

Read `AGENTS.md`, `LAB_BRIEF.md`, `data/raw-tickets.json`,
`schemas/triage.schema.json`, and `handoff/triage.json`.

Implement Stage 2 of the lab in plain JavaScript for the installed Node.js
runtime.

Requirements:

1. Validate `handoff/triage.json` against
   `schemas/triage.schema.json` with Ajv 2020.
2. Add semantic validation that JSON Schema alone does not guarantee:
   - `dataset_id` must equal the raw dataset's ID.
   - output ticket IDs must match input IDs exactly;
   - no ticket ID may be missing, duplicated, or invented;
   - `needs_clarification: false` requires an empty `information_gaps`;
   - `needs_clarification: true` requires at least one information gap.
3. Generate `output/action-report.md` deterministically. It must include:
   - dataset and workflow versions;
   - total ticket count;
   - counts by priority and category;
   - a priority-ordered ticket table;
   - a clarification-needed section.
4. Do not reinterpret or rewrite Stage 1 classifications.
5. Provide one command that validates the handoff and generates the report.
6. Use Node's built-in test runner. Cover successful generation and invalid
   schema, missing ID, duplicate ID, invented ID, dataset mismatch, inconsistent
   clarification fields, and empty tickets.
7. Keep dependencies and code small. Return actionable errors and non-zero exit
   status on failure.
8. Update the README and technical documentation only with behavior you have
   actually verified. Do not fabricate transcripts, screenshots, timings, or
   test output.
9. Run the complete test suite and the end-to-end command. Report exactly what
   passed and identify anything that remains pending.

