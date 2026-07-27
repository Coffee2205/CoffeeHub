# Authentication foundation

## Luồng chuẩn

```text
email/password
→ Supabase Auth
→ HttpOnly cookie session managed by @supabase/ssr
→ src/proxy.ts refreshes and forwards cookies
→ Server Component/Action verifies getClaims()
→ ownership or app_metadata.role authorization
```

Proxy chỉ làm refresh và redirect sớm. `/app` gọi lại `requireUser()` trong server layout; `/admin` gọi `requireAdmin()`. Mutation phải tiếp tục gọi guard phù hợp, không tin `userId` hay role do client gửi.

Role quản trị chỉ lấy từ `app_metadata.role`. `user_metadata` có thể dùng cho dữ liệu hồ sơ không nhạy cảm nhưng không được dùng để phân quyền.

## Supabase configuration

- Dùng `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; publishable key được phép ở browser, secret/service-role key thì không.
- Đặt Site URL theo `NEXT_PUBLIC_APP_URL` của từng môi trường.
- Allow redirect URL `/auth/confirm` cho development, preview và production trước khi kiểm thử email confirmation ở môi trường đó.
- Free Plan mới dùng email template mặc định; Task 05 không bật custom SMTP, add-on hoặc billing.

`private.handle_new_auth_user()` là trigger function `SECURITY DEFINER` bắt buộc để đồng bộ từ schema `auth`; function nằm ngoài exposed schema, có `search_path` rỗng và bị revoke khỏi `PUBLIC`, `anon`, `authenticated`. Trigger tạo idempotently một `public.users` và một `public.profiles` cho mỗi Auth user mới.

## Trạng thái lỗi và session

- Credential sai trả lỗi chung, không tiết lộ email có tồn tại hay không.
- Session thiếu, hết hạn hoặc không xác minh được chuyển về `/login` và giữ đường dẫn `/app` dự định.
- Proxy gọi `getClaims()` ngay sau khi tạo server client để refresh token/cookie khi cần.
- Logout chờ `signOut()` rồi chuyển về login; private cache dành cho feature sau phải được xóa cùng logout.
- Confirmation token/code lỗi chuyển về trạng thái `confirmation-failed`.

## Kiểm thử

- Unit test xác minh anonymous claim, user thường, admin và việc không tin `user_metadata`.
- HTTP smoke-test xác minh `/login` render, `/app/*` anonymous trả redirect 307 có `next`, `/unauthorized` render.
- Migration mapping được kiểm thử bằng Auth user tạm trong transaction và rollback; không để lại account hoặc dữ liệu test.
- Kiểm thử đăng nhập/refresh/logout end-to-end với account thật cần redirect URL và email nhận confirmation của môi trường triển khai; không tạo credential ngoài phạm vi Task 05.
