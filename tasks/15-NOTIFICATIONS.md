# Task 15 — Notifications

## Trạng thái

Pending

## Mục tiêu

Tạo domain Reminder và nền tảng notification có giới hạn rõ

## Dependency

- `14-CHECKLISTS.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/notifications và settings liên quan`
- **Luồng:** Tạo/cấu hình reminder và thấy notification/deep link trong luồng hỗ trợ.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

- [ ] Reminder model
- [ ] Notification preferences
- [ ] One-time/recurring rules
- [ ] Update/cancel theo entity
- [ ] Deep link
- [ ] Permission UX
- [ ] Ghi giới hạn iPhone PWA

## Không thực hiện

- Không khẳng định background delivery chưa test
- Không thêm dịch vụ trả phí

## File dự kiến

- `src/features/notifications/*`
- `src/app/app/settings/notifications/*`

## Ảnh hưởng database

Thêm Reminder/Preference; scheduling backend tùy giải pháp được chốt.

## Tiêu chí hoàn thành

- Reminder liên kết entity
- Update/cancel đúng
- Permission rõ
- Giới hạn được tài liệu hóa
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
