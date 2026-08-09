# AI Architecture

The live runtime path is `Server Action → AI Orchestrator → Provider Registry → AI SDK provider`. Chat and structured proposals share this path. Structured JSON is parsed by the existing action-specific runtime schema before a draft is created; only the explicit confirmation lifecycle may call Feature Services and persist data.

CoffeeHub AI follows one non-negotiable path:

```text
Owner request → Context Builder → Provider Registry → Structured Proposal
→ Runtime Validation → Editable Preview → Owner Confirmation
→ Existing Feature Service → Database
```

Providers never import Prisma, repositories or feature mutations. Multi-turn chat and the confirmation/action boundary are delivered. OpenAI, Groq and Gemini use server-only AI SDK adapters through the registry/orchestrator; `MockAIProvider` remains explicit for network-free tests and development.

The module is split into typed actions, centralized config, provider contracts, runtime schemas, context builders, prompt templates, proposal mappers, confirmation policy, normalized errors and UI. `AIConversation`, `AIMessage` and `AISetting` provide optional owner-scoped history and preferences with forced RLS, retention and a separately confirmed history deletion flow.

Streaming and non-streaming are represented in `AIProvider`. The Mock Provider uses a client-visible streaming state; real provider token streaming and rate-limit storage require later provider-integration tasks. Proposal audit persistence is active.

The chatbot and the action engine share one UI but not one trust boundary. Assistant text can stream immediately; a database mutation can only start from a validated structured `AIActionProposal` shown to the owner. “Đồng ý”, “Lưu kế hoạch” or an equivalent explicit CTA confirms the current proposal only. The server then calls existing feature services; it never executes model-generated SQL or accepts a model-provided `userId`.
## Planning entity linking

Planning uses one graph backed by the existing domain tables: `Goal → Roadmap → RoadmapStage → Task`, while Checklist keeps the D-014 rule of exactly zero or one Goal/Roadmap/Task parent. Before generation, the owner-scoped Entity Resolver ranks bounded active/recent candidates by normalized title and keyword overlap. The server—not the model—adds relationship intent and IDs to the proposal envelope.

The decision order is `FIND → MATCH → LINK → EXTEND → CREATE`. Low-confidence or ambiguous candidates remain unconfirmed until the owner selects a parent or explicitly chooses Create New. Roadmap extension appends new Stage/Task records to the selected Roadmap in one transaction. No AI-specific Goal, Roadmap or Task tables exist.
