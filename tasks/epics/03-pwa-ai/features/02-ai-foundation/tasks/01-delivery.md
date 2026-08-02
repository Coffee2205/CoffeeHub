# Task 01 — AI Foundation delivery

## Hierarchy

- Epic: `PWA and AI`
- Feature: `AI Foundation`
- Source roadmap item: `tasks/epics/03-pwa-ai/features/02-ai-foundation/FEATURE.md`
- Task path: `tasks/epics/03-pwa-ai/features/02-ai-foundation/tasks/01-delivery.md`

## Trạng thái

Completed — 2026-08-02

## Mục tiêu

Tạo provider abstraction, fallback, structured output và AI action foundation

## Dependency

- `tasks/epics/01-public-cv-cms/features/02-public-cv-experience/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Provider interface
- [x] OpenAI provider stub
- [x] Groq provider stub
- [x] Gemini provider stub
- [x] Mock Provider
- [x] Config order
- [x] Timeout/error normalization
- [x] Fallback policy
- [x] Structured schemas
- [x] AIActionLog persistence type
- [x] Confirmation policy
- [x] Rate/payload limit placeholders
- [x] No client secret
- [x] Context builder, prompt library and proposal mappers
- [x] Mock UI at `/app/ai`

## Không thực hiện

- Không tạo tính năng AI lớn
- Không commit DB từ provider
- Không bật billing trả phí

## File dự kiến

- `src/features/ai/providers/*`
- `src/features/ai/services/*`
- `src/features/ai/schemas/*`
- `src/app/api/ai/*`

## Ảnh hưởng database

Thêm AIActionLog và model liên quan; migration bắt buộc review.

## Tiêu chí hoàn thành

- Provider có thể bật/tắt
- Fallback đúng loại lỗi
- Output validate
- Secret chỉ server
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/features/ai/*`: typed actions/config/providers/schemas/errors/policies/context/prompts/mappers/services and UI.
- `src/app/app/ai/*`: protected AI Assistant mock route and loading state.
- `.env.example`, `tests/ai-foundation.test.ts` and AI architecture documentation.

### Quyết định kỹ thuật

- Direct user instruction authorized this foundation before the older Public CV dependency; no dependent public-CV code was changed.
- OpenAI/Groq/Gemini are safe stubs with no SDK/network; Mock Provider is the only executable provider.
- Providers create runtime-validated proposals only. Mapping prepares existing form values; save/confirmation remains disabled and there is no database write or migration.
- AI persistence models are TypeScript contracts only until a reviewed migration task exists.

### Vấn đề còn lại

- Real provider adapters, persistent rate limiting/audit logs, context repositories and confirmation-to-service integration require separate tasks and credentials/approval where applicable.

### Kiểm tra

- Test: Đạt 46/46 (`npm test`).
- Lint: Đạt (`npm run lint`).
- Typecheck: Đạt (`npm run typecheck`).
- Build: Đạt (`npm run build`, Prisma generate + Next.js production build).
- Manual test: Owner `/app/ai` desktop 1440×1000 và mobile 390×844; empty/loading, editable Goal preview, disabled save, normalized error, mock/provider badges, zero external AI browser request, no overflow/overlay/browser error.
