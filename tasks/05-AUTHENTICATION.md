# Task 05 — Authentication

## Trạng thái

Pending

## Mục tiêu

Triển khai Supabase Auth email/password, session SSR và authorization theo role/ownership.

## Dependency

- `04-DATABASE-FOUNDATION.md` phải hoàn thành.

## Công việc

- [ ] Tạo Supabase Auth browser/server clients bằng `@supabase/ssr` và cookie theo API Next.js hiện hành.
- [ ] Triển khai đăng ký/đăng nhập email-password, login, logout, session persistence và trạng thái loading/error.
- [ ] Tạo login và logout.
- [ ] Tạo server-side session helper.
- [ ] Bảo vệ private routes.
- [ ] Tạo unauthorized/error state.
- [ ] Xác lập quy tắc ownership theo `userId`.
- [ ] Kiểm tra session hết hạn.
- [ ] Map `auth.users.id` với profile ứng dụng; role admin lấy từ `app_metadata`, không từ `user_metadata`.
- [ ] Bảo vệ route và mutation Admin ở server; kiểm thử anonymous, user, admin, session expiry/refresh.

## Không thực hiện

- Không dùng NextAuth/Auth.js, không tự lưu mật khẩu và không thêm OAuth/Google mặc định; OAuth là task riêng.
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
