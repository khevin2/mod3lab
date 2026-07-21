# Stage 1 evidence

## Run metadata

- Date saved: 2026-07-20
- Chat tool: ChatGPT in Chrome
- UX category: Chat
- Input files:
  - `data/raw-tickets.json`
  - `schemas/triage.schema.json`
- Prompt: `prompts/stage-1-chat.md`

## What I did

I uploaded the synthetic dataset and schema to ChatGPT and sent the Stage 1
prompt. I copied ChatGPT's JSON response into `handoff/triage.json` without
changing its classifications or field values.

My screenshots show the actual interaction:

- `screenshots/stage-1-input.png` shows the two attached files and prompt.
- `screenshots/stage-1-output.png` shows ChatGPT's structured JSON response.

## Validation

I ran:

```powershell
npm run validate:stage1
```

Result:

```text
Stage 1 handoff passed JSON Schema and semantic validation for 10 tickets.
```

Manual classification edits: none.

