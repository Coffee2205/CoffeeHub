# AI Security

- AI Server Actions authenticate first and apply a bounded per-instance owner rate limit before provider selection. This is abuse protection, not a distributed production quota system.
- Provider availability is derived server-side; the browser receives only selected provider/model and fallback indicators, never key status or secrets.

- Provider keys are server-only and never use `NEXT_PUBLIC_*`.
- Providers receive minimum allow-listed context, never passwords, tokens, cookies, database URLs or full workspace exports.
- Owner authentication occurs before proposal generation.
- Payload and context limits are centralized configuration placeholders.
- Every structured proposal passes runtime validation.
- Create/update proposals for Goal, Roadmap, Task, Event, Note or Checklist require an editable preview and explicit single-use owner confirmation; delete and privileged operations are forbidden.
- Confirmation is bound to the authenticated owner, proposal hash/version and allowed action list; changing the proposal invalidates the previous confirmation.
- The server derives ownership from the session, revalidates all fields/relations and commits through existing services with transaction/idempotency protection.
- Model output is never interpreted as SQL, Prisma arguments, authorization claims or a trusted `userId`.
- Provider errors are normalized before reaching UI; raw payloads and secrets are not logged.
- Prompt injection is handled by treating user/context text as data, using fixed safety instructions, allow-listed actions, runtime schemas and a separate confirmation/service boundary.
- Mock mode is clearly labelled and cannot write data. Real mode must not silently fall back to mock in production without an explicit configuration decision.

Conversation, proposal, usage and action-log persistence now uses reviewed additive migrations, owner-scoped forced RLS, bounded retention and explicit deletion controls. Provider output still cannot access these tables directly.
## Planning relationship security

- Model output is never trusted for Goal/Roadmap/Stage/Task UUIDs. The owner-scoped resolver supplies candidates and the server stores relationship intent separately from generated content.
- Save and confirm reload every selected parent, verify owner, and enforce `roadmap.goalId` and `stage.roadmapId` hierarchy. Ambiguous relationships cannot commit.
