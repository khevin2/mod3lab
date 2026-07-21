# Lab submission summary

I implemented a two-stage AI workflow across two UX types.

In Stage 1, I used ChatGPT in Chrome to classify a synthetic customer-support
dataset. ChatGPT returned the structured JSON stored in
`handoff/triage.json`. In Stage 2, I used the Codex extension in Visual Studio
Code to consume that handoff and implement a deterministic JavaScript
validator, report generator, CLI command, and automated tests.

## Deliverables

- Working cross-UX workflow: complete and verified
- Workflow diagram: `docs/workflow-diagram.md`
- Written documentation: `README.md` and `docs/`
- Authentic UX evidence: `evidence/screenshots/`
- Generated result: `output/action-report.md`

## Verification

I verified the completed work on 2026-07-21:

- Stage 1 validation passed for all 10 tickets.
- All 10 automated tests passed with 0 failures.
- The end-to-end Stage 2 command exited successfully.
- The workflow regenerated the prioritized action report.

## Rubric alignment

| Criterion | How my work addresses it |
| --- | --- |
| Functionality | My handoff validates, all tests pass, and the workflow generates the report end-to-end. |
| Adaptability | I used a provider-neutral JSON Schema contract, reusable Markdown prompts, and ordinary JavaScript commands without an AI SDK dependency. |
| Documentation | I included a Mermaid diagram, step-by-step notes, testing documentation, evidence records, and a screenshot index. |
| Efficiency | One command performs validation, ID reconciliation, counting, sorting, clarification extraction, and report formatting for all 10 tickets. |

I did not claim a time-saving percentage because I did not measure a controlled
manual baseline. My efficiency claim is limited to the manual operations that
the working implementation demonstrably automates.

