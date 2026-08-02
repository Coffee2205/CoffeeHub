# AI Architecture

CoffeeHub AI follows one non-negotiable path:

```text
Owner request → Context Builder → Provider Registry → Structured Proposal
→ Runtime Validation → Editable Preview → Owner Confirmation
→ Existing Feature Service → Database
```

Providers never import Prisma, repositories or feature mutations. The current delivery stops at editable preview; confirmation/save is intentionally disabled. `MockAIProvider` is the only working provider and performs no network request. OpenAI, Groq and Gemini are explicit stubs until separate integration tasks add server-only adapters.

The module is split into typed actions, centralized config, provider contracts, runtime schemas, context builders, prompt templates, proposal mappers, confirmation policy, normalized errors and UI. Persistence types are forward-looking contracts only; no AI tables or migrations exist yet.

Streaming and non-streaming are represented in `AIProvider`. Real streaming, rate-limit storage and audit persistence require later tasks.
