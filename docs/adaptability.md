# Adaptability

I designed the workflow so that its handoff does not depend on one specific AI
provider or model.

## Provider-neutral parts

- I stored the source data as plain JSON.
- I defined the handoff with JSON Schema Draft 2020-12.
- I stored both prompts as normal Markdown files.
- I implemented validation and report generation as ordinary JavaScript
  commands.
- My tests do not call an AI model.
- I generated the final result as standard Markdown.

## Tool-specific parts

Only the UX invocation is tool-specific:

- I used ChatGPT's chat interface for Stage 1.
- I used the Codex extension in VS Code for Stage 2.

The contract between these stages contains no model name, provider API,
proprietary message format, or provider-specific metadata.

## How I could substitute other tools

- I could replace ChatGPT with another chat AI if it receives the same dataset,
  schema, and Stage 1 prompt and returns conforming JSON.
- I could replace Codex with another IDE assistant if it receives the same
  repository, handoff, and Stage 2 prompt and passes the same tests.
- I could change the final output to HTML or CSV without changing Stage 1; I
  would only need to replace the deterministic formatter and its tests.

I deliberately kept AI API calls out of the application code. This keeps
credentials, pricing, model availability, and provider SDK changes outside the
working workflow.

