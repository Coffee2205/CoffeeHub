# Task 01 — AI Goal Assistant delivery

## Hierarchy

- Epic: `PWA and AI`
- Feature: `AI Goal Assistant`
- Source roadmap item: `tasks/epics/03-pwa-ai/features/03-ai-goal-assistant/FEATURE.md`
- Task path: `tasks/epics/03-pwa-ai/features/03-ai-goal-assistant/tasks/01-delivery.md`

## Trạng thái

Pending

## Mục tiêu

Cho AI phân tích yêu cầu lập kế hoạch và tạo Goal/Roadmap/Stage/Task/Checklist proposal đúng schema, sau đó chỉ ghi database qua Feature Service khi owner xác nhận proposal hiện tại.

## Dependency

- `tasks/epics/03-pwa-ai/features/02-ai-foundation/FEATURE.md` phải hoàn thành.

## Subtasks

- [ ] Analyze Goal
- [ ] Generate Goal proposal
- [ ] Generate Roadmap proposal
- [ ] Generate Task proposal
- [ ] Generate Checklist proposal khi phù hợp
- [ ] Preview/edit/discard
- [ ] Confirm proposal hiện tại bằng single-use confirmation
- [ ] Server re-validation, ownership và relation checks
- [ ] Confirm transaction qua existing Feature Services; không gọi Prisma từ provider
- [ ] Idempotency
- [ ] Audit log
- [ ] Link tới Goal/Roadmap/Task vừa tạo sau commit
- [ ] Undo chỉ khi có cơ chế thực tế; không hứa bằng UI giả

## Không thực hiện

- Không auto-save Goal/Roadmap/Task/Checklist trước xác nhận
- Không gọi Prisma trong provider
- Không thực thi SQL/model output, delete, đổi role/quyền hoặc CMS publish

## File dự kiến

- `src/app/app/goals/*`
- `src/features/ai/actions/*`
- `src/features/goals/*`

## Ảnh hưởng database

Dùng model AI foundation; có thể thêm proposal storage nếu được chốt.

## Tiêu chí hoàn thành

- Proposal chưa lưu được phân biệt rõ
- Confirm mới commit
- Sửa proposal làm mất hiệu lực xác nhận cũ
- Payload commit được parse lại bằng schema của feature và `userId` lấy từ session
- Không duplicate khi retry
- Audit đầy đủ
- Batch Goal → Roadmap → Stage → Task rollback toàn bộ khi một bước lỗi
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
