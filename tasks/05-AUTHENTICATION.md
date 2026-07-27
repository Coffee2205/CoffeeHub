# Task 05 — Authentication

## Trạng thái

Pending

## Mục tiêu

Thiết lập hoặc hoàn thiện authentication và data ownership.

## Dependency

- `04-DATABASE-FOUNDATION.md` phải hoàn thành.

## Công việc

- [ ] Xác nhận auth solution sau audit.
- [ ] Tạo login và logout.
- [ ] Tạo server-side session helper.
- [ ] Bảo vệ private routes.
- [ ] Tạo unauthorized/error state.
- [ ] Xác lập quy tắc ownership theo `userId`.
- [ ] Kiểm tra session hết hạn.

## Không thực hiện

- Không đổi auth provider nếu không có quyết định được ghi lại.
- Không lưu mật khẩu thủ công nếu dùng provider chuẩn.
- Không chỉ bảo vệ ở client.

## File dự kiến

- `src/app/login/*`
- `src/lib/auth*`
- `middleware hoặc server guard tương ứng`
- `project-log/*`

## Ảnh hưởng database

Có thể cần model/session table tùy auth provider; phải ghi migration rõ ràng.

## Tiêu chí hoàn thành

- Người chưa đăng nhập không truy cập private route.
- Logout hủy session.
- Server có current user đáng tin cậy.
- Không lộ secret.
- Lint, typecheck và build đạt.

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
