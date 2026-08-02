# AI Security

- Provider keys are server-only and never use `NEXT_PUBLIC_*`.
- Providers receive minimum allow-listed context, never passwords, tokens, cookies, database URLs or full workspace exports.
- Owner authentication occurs before proposal generation.
- Payload and context limits are centralized configuration placeholders.
- Every structured proposal passes runtime validation.
- Create/update proposals require explicit confirmation; delete and privileged operations are forbidden.
- Provider errors are normalized before reaching UI; raw payloads and secrets are not logged.
- Prompt injection is handled by treating user/context text as data, using fixed safety instructions, allow-listed actions, runtime schemas and a separate confirmation/service boundary.
- Mock mode is clearly labelled and cannot write data. Real mode must not silently fall back to mock in production without an explicit configuration decision.

Future persistence for conversations, proposals, usage and action logs requires a reviewed additive migration and owner-scoped RLS. No such tables are created by AI Foundation.
