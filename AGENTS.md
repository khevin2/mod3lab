# Lab Working Agreement

## Source of truth

Follow the requirements in `LAB_BRIEF.md` and the workflow documented in this
repository. If a requirement is unclear, stop and ask the user instead of
inventing an answer.

## Confirmed decisions

- Problem domain: synthetic customer-support ticket triage.
- Stage 1 UX: a chat-based AI tool.
- Stage 2 UX: the Codex IDE extension in Visual Studio Code.
- Implementation language: plain JavaScript on Node.js.
- Handoff format: JSON validated against JSON Schema.
- Final output: a prioritized Markdown action report.

## Implementation boundaries

- Keep all data explicitly synthetic.
- Do not modify `data/raw-tickets.json` or a valid `handoff/triage.json`.
- Do not fabricate AI transcripts, screenshots, timings, or test results.
- Keep prompts provider-neutral except where a file explicitly documents the
  selected UX surface.
- Prefer a small implementation with one validation dependency and Node's
  built-in test runner.
- Make failures actionable and return a non-zero exit code for invalid input.
- Run the complete test suite before claiming the workflow works.

