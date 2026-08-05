# Task 19 — AI Goal Assistant

## Trạng thái

Pending

## Mục tiêu

Cho AI phân tích Goal và tạo Goal/Roadmap/Task proposal có xác nhận

## Dependency

- `18-AI-FOUNDATION.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/goals/[id]/ai`
- **Luồng:** Tạo proposal Goal/Roadmap/Task, chỉnh sửa, xác nhận và thấy dữ liệu được tạo đúng một lần.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

- [ ] Analyze Goal
- [ ] Generate Goal proposal
- [ ] Generate Roadmap proposal
- [ ] Generate Task proposal
- [ ] Preview/edit/discard
- [ ] Confirm transaction
- [ ] Idempotency
- [ ] Audit log
- [ ] Undo nếu triển khai thật

## Không thực hiện

- Không auto-save Goal/Roadmap/batch Task mặc định
- Không gọi Prisma trong provider

## File dự kiến

- `src/app/app/goals/*`
- `src/features/ai/actions/*`
- `src/features/goals/*`

## Ảnh hưởng database

Dùng model AI foundation; có thể thêm proposal storage nếu được chốt.

## Tiêu chí hoàn thành

- Proposal chưa lưu được phân biệt rõ
- Confirm mới commit
- Không duplicate khi retry
- Audit đầy đủ
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
- Visible result URL: Chưa có.
- How to use: Chưa cập nhật.
- Browser desktop: Chưa chạy.
- Browser mobile: Chưa chạy.
- Manual test: Chưa chạy.
