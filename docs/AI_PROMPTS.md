# AI Prompts

Prompt templates live in the prompt library, not routes or components. Each template separates system instruction, user input, allow-listed context, expected output, safety constraints, language and timezone.

The library includes templates for chat, goal analysis/generation, roadmap, tasks, checklist, daily plan, weekly plan, progress review and note summary. Templates are structural starting points rather than production-optimized prompts.

User input and retrieved context are untrusted. Provider instructions must never obey embedded requests to reveal secrets, bypass schema validation, change permissions or execute writes. Structured output is parsed after generation; prompt wording is never a security boundary.
