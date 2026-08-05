# Task 20 — AI Personal Assistant

## Trạng thái

Pending

## Mục tiêu

Tạo trợ lý AI đọc context được phép và hỗ trợ daily/weekly planning

## Dependency

- `19-AI-GOAL-ASSISTANT.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/ai`
- **Luồng:** Chat với trợ lý, chọn context và nhận daily/weekly plan có nguồn context minh bạch.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

- [ ] Chat UI
- [ ] Context selection
- [ ] Task/Goal query tools
- [ ] Daily plan
- [ ] Weekly review
- [ ] Note summary
- [ ] AI settings
- [ ] Disable AI
- [ ] Data minimization

## Không thực hiện

- Không gửi toàn bộ database
- Không tự sửa dữ liệu quan trọng

## File dự kiến

- `src/app/app/ai/*`
- `src/features/ai/chat/*`
- `src/app/app/settings/ai/*`

## Ảnh hưởng database

Có thể thêm AIConversation/AIMessage tùy quyết định lưu history.

## Tiêu chí hoàn thành

- Context minh bạch
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
- Visible result URL: Chưa có.
- How to use: Chưa cập nhật.
- Browser desktop: Chưa chạy.
- Browser mobile: Chưa chạy.
- Manual test: Chưa chạy.
