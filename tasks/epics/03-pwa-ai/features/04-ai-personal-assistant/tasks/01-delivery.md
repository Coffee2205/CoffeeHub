# Task 01 — AI Personal Assistant delivery

## Hierarchy

- Epic: `PWA and AI`
- Feature: `AI Personal Assistant`
- Source roadmap item: `tasks/epics/03-pwa-ai/features/04-ai-personal-assistant/FEATURE.md`
- Task path: `tasks/epics/03-pwa-ai/features/04-ai-personal-assistant/tasks/01-delivery.md`

## Trạng thái

Pending

## Mục tiêu

Tạo trợ lý AI có hội thoại nhiều lượt, lịch sử chat và streaming/response states như chatbot thông thường; khi người dùng yêu cầu, AI có thể đề xuất tạo/sửa Event trong Calendar, Note và dữ liệu kế hoạch nhưng chỉ commit sau xác nhận.

## Dependency

- `tasks/epics/03-pwa-ai/features/03-ai-goal-assistant/FEATURE.md` phải hoàn thành.

## Subtasks

- [ ] Conversation list, new chat, rename/archive và multi-turn Chat UI
- [ ] User/assistant message history, pending/streaming/error/retry/cancel states
- [ ] Persist AIConversation/AIMessage với owner-scoped RLS nếu owner bật history
- [ ] Context selection
- [ ] Task/Goal query tools
- [ ] Daily plan
- [ ] Weekly review
- [ ] Note summary
- [ ] Event/Calendar proposal với timezone, start/end, recurrence và relation validation
- [ ] Note create/update proposal đúng schema và version rules
- [ ] Editable action preview, explicit confirm/discard và result links
- [ ] Reuse AI Goal Assistant action pipeline cho Goal/Roadmap/Task/Checklist
- [ ] AI settings
- [ ] Disable AI
- [ ] Data minimization

## Không thực hiện

- Không gửi toàn bộ database
- Không tự sửa bất kỳ entity nào trước xác nhận
- Không dùng câu chat mơ hồ làm sự đồng ý; xác nhận phải gắn proposal cụ thể
- Không delete, đổi role/quyền, publish CMS, chạy migration hoặc thực thi SQL do model tạo

## File dự kiến

- `src/app/app/ai/*`
- `src/features/ai/chat/*`
- `src/app/app/settings/ai/*`

## Ảnh hưởng database

Audit schema trước. Nếu chưa có, thêm AIConversation, AIMessage, AIActionProposal/AIActionLog và IdempotencyRecord bằng migration additive, owner-scoped RLS và retention/settings rõ ràng. Event/Note/Goal/Roadmap/Task phải dùng model và Feature Service hiện có, không tạo bảng song song.

## Tiêu chí hoàn thành

- Context minh bạch
- Chat nhiều lượt hoạt động độc lập với action proposal
- Lịch sử conversation/message đúng owner và có thể tắt/xóa theo luồng riêng được xác nhận
- Proposal ghi database luôn có preview, confirm và trạng thái success/failure rõ ràng
- AI tạo được Event/Note đúng schema và hiển thị ở Calendar/Notes sau commit
- Có thể tắt AI
- Không lộ secret
- Provider fallback hoạt động
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Chưa cập nhật.

### Quyết định kỹ thuật

- Chưa cập nhật.

### Vấn đề còn lại

- Chưa cập nhật.

### Kiểm tra

- Lint: Chưa chạy.
- Typecheck: Chưa chạy.
- Build: Chưa chạy.
- Manual test: Chưa chạy.
