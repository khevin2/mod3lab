# End-to-end workflow steps

These are the steps I followed to complete the workflow.

## Prerequisites I used

- ChatGPT in a browser
- Visual Studio Code with the Codex extension installed and signed in
- Node.js and npm
- This repository opened as the active VS Code workspace

## Stage 1: Chat UX

1. I started a new ChatGPT conversation so unrelated context would not affect
   the result.
2. I attached `data/raw-tickets.json` and `schemas/triage.schema.json`.
3. I sent the prompt from `prompts/stage-1-chat.md`.
4. ChatGPT returned one structured JSON object.
5. I saved that response unchanged as `handoff/triage.json`.
6. I validated it with `npm run validate:stage1`.
7. I preserved the ChatGPT input and output screenshots under
   `evidence/screenshots/`.

I did not manually change ChatGPT's classifications. If validation had failed,
I would have returned the errors to Stage 1 instead of silently repairing the
handoff.

## Stage 2: IDE UX

1. I opened the repository in Visual Studio Code.
2. I confirmed that `handoff/triage.json` contained the validated Stage 1
   output.
3. I opened the Codex extension and started a new task.
4. I sent the prompt from `prompts/stage-2-codex-ide.md`.
5. I reviewed the implementation and Codex's nine-file change set.
6. I ran `npm test` and confirmed that all 10 tests passed.
7. I ran `npm run stage2` to validate the handoff and generate the report.
8. I reviewed `output/action-report.md`.
9. I saved the Codex summary, diff, test, and successful-run screenshots under
   `evidence/screenshots/`.

## Final verification

I confirmed all of the following:

- The handoff is valid against the JSON Schema.
- The handoff contains the same dataset ID and ticket IDs as the source.
- All positive and negative automated tests pass.
- Invalid handoffs return a non-zero exit status and do not produce a report.
- The end-to-end command succeeds for the valid handoff.
- The generated totals match the 10 handoff tickets.
- The report orders tickets by priority and isolates clarification needs.
- Both AI UX stages have authentic screenshot evidence.

