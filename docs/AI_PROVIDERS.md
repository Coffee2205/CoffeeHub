# AI Providers

Default priority is OpenAI → Groq → Gemini → Mock and is configurable with `AI_PROVIDER_FALLBACK_ORDER`. Feature code never selects providers directly; it calls the registry/service layer.

Real adapters are safe stubs and always return `PROVIDER_NOT_CONFIGURED`. No provider SDK is installed. Mock mode is server-only, requires no key, returns development-labelled schema-valid proposals, simulated latency, fake usage and optional normalized errors.

Fallback is allowed only for provider unavailable, rate limit, quota, timeout and appropriate network errors. Validation, authorization, unsafe action and invalid structured output never trigger fallback. One request has one proposal path and no provider can commit data.

When real AI is added, disable mock mode explicitly, configure a server-only key/model, implement the adapter, add provider-specific tests and verify production safeguards. ChatGPT Plus is not API credit.
