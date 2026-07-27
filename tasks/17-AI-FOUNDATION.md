# Task 17 — AI foundation

## Trạng thái

Pending

## Mục tiêu

Tạo provider abstraction, fallback, structured output và AI action foundation

## Công việc

- [ ] Provider interface
- [ ] OpenAI provider
- [ ] Groq provider
- [ ] Gemini provider
- [ ] Config order
- [ ] Timeout/error normalization
- [ ] Fallback policy
- [ ] Structured schemas
- [ ] AIActionLog
- [ ] Confirmation policy
- [ ] Rate limit
- [ ] No client secret

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
