# Multi-Stage AI Customer-Support Workflow

In this lab, I built a workflow that passes work between two different AI UX
types. I used ChatGPT as the chat-based tool and the Codex extension in Visual
Studio Code as the IDE-based tool.

My workflow converts synthetic customer-support tickets into a validated,
prioritized Markdown action report:

1. I uploaded the synthetic tickets and JSON Schema to ChatGPT.
2. ChatGPT classified every ticket and returned a structured JSON handoff.
3. I saved that output unchanged as `handoff/triage.json`.
4. I validated the handoff before passing it to the next stage.
5. I used Codex in VS Code to implement the JavaScript validator, report
   generator, CLI command, and automated tests.
6. I ran the tests and generated `output/action-report.md`.

No real customer information is used anywhere in this project.

## Final status

| Deliverable | Status |
| --- | --- |
| Synthetic test dataset | Complete |
| ChatGPT JSON handoff | Complete and validated |
| Codex IDE implementation | Complete |
| Automated tests | Complete: 10 passed, 0 failed |
| End-to-end workflow | Complete |
| Workflow diagram and written documentation | Complete |
| Chat and IDE screenshot evidence | Complete |

## Tools I used

- Chat UX: ChatGPT in Chrome
- IDE UX: Codex extension in Visual Studio Code
- Language: JavaScript
- Runtime: Node.js
- Validation: Ajv with JSON Schema Draft 2020-12
- Tests: Node.js built-in test runner

## Project structure

```text
data/       Synthetic customer-support tickets
schemas/    JSON Schema for the cross-tool handoff
prompts/    Reusable prompts for ChatGPT and Codex
handoff/    Unedited JSON returned by ChatGPT
src/        Validation and report-generation logic
scripts/    Commands for handoff validation and Stage 2 execution
tests/      Positive and negative automated tests
output/     Generated prioritized action report
docs/       Diagram, workflow notes, testing, adaptability, and efficiency
evidence/   Authentic screenshots and command results
```

## Run the workflow

Install the pinned dependency:

```powershell
npm install
```

Validate the ChatGPT handoff:

```powershell
npm run validate:stage1
```

Run all automated tests:

```powershell
npm test
```

Validate the handoff and generate the final report:

```powershell
npm run stage2
```

## Verified result

On 2026-07-21, I independently reran the complete workflow:

- Stage 1 validation passed for all 10 tickets.
- All 10 automated tests passed with 0 failures.
- `npm run stage2` completed successfully.
- The final report was regenerated at `output/action-report.md`.

The exact terminal results are in `evidence/test-results.txt`, and I indexed my
screenshots in `evidence/screenshots/README.md`.

## Documentation

- Final submission summary: `SUBMISSION.md`
- Workflow diagram: `docs/workflow-diagram.md`
- Step-by-step process: `docs/workflow-steps.md`
- Testing: `docs/testing.md`
- Adaptability: `docs/adaptability.md`
- Efficiency: `docs/efficiency.md`
- Rubric audit: `docs/rubric-audit.md`

