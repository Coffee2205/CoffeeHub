# AI Architecture

CoffeeHub AI follows one non-negotiable path:

```text
Owner request → Context Builder → Provider Registry → Structured Proposal
→ Runtime Validation → Editable Preview → Owner Confirmation
→ Existing Feature Service → Database
```

Providers never import Prisma, repositories or feature mutations. The completed AI Foundation task stops at editable preview; confirmation/save is intentionally disabled there. Follow-up delivery must add normal multi-turn chat plus the confirmation/action boundary described here. `MockAIProvider` is currently the only working provider and performs no network request. OpenAI, Groq and Gemini remain explicit stubs until separate integration tasks add server-only adapters.

The module is split into typed actions, centralized config, provider contracts, runtime schemas, context builders, prompt templates, proposal mappers, confirmation policy, normalized errors and UI. Persistence types are forward-looking contracts only; no AI tables or migrations exist yet.

Streaming and non-streaming are represented in `AIProvider`. Real streaming, rate-limit storage and audit persistence require later tasks.

The chatbot and the action engine share one UI but not one trust boundary. Assistant text can stream immediately; a database mutation can only start from a validated structured `AIActionProposal` shown to the owner. “Đồng ý”, “Lưu kế hoạch” or an equivalent explicit CTA confirms the current proposal only. The server then calls existing feature services; it never executes model-generated SQL or accepts a model-provided `userId`.
