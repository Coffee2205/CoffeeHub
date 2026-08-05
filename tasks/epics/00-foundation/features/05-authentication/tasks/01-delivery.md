# Task 01 — Authentication delivery

## Hierarchy

- Epic: `Foundation`
- Feature: `Authentication`
- Source roadmap item: `tasks/epics/00-foundation/features/05-authentication/FEATURE.md`
- Task path: `tasks/epics/00-foundation/features/05-authentication/tasks/01-delivery.md`

## Trạng thái

Completed — 2026-07-27

## Mục tiêu

Triển khai Supabase Auth email/password, session SSR và authorization theo role/ownership.

## Dependency

- `tasks/epics/00-foundation/features/04-database-foundation/FEATURE.md` đã hoàn thành.

## Subtasks

- [x] Tạo Supabase Auth browser/server clients bằng `@supabase/ssr` và cookie API Next.js 16.
- [x] Triển khai đăng ký/đăng nhập email-password, session persistence và trạng thái loading/error/success.
- [x] Tạo login và logout.
- [x] Tạo server-side claims/session helper.
- [x] Bảo vệ private routes bằng proxy refresh và server layout guard.
- [x] Tạo unauthorized/error state.
- [x] Xác lập ownership từ verified claim `sub`, không tin `userId` client.
- [x] Xử lý session thiếu/hết hạn và giữ intended path.
- [x] Map `auth.users.id` với User/Profile; admin chỉ lấy từ `app_metadata`.
- [x] Bảo vệ route/mutation Admin ở server; kiểm thử anonymous, user và admin claim mapping.

## Không thực hiện

- Không thêm Auth.js, OAuth hoặc Google login.
- Không lưu mật khẩu thủ công.
- Không dùng client guard làm lớp bảo vệ duy nhất.
- Không bật SMTP, billing hoặc tùy biến email template Free Plan.

## Tiêu chí hoàn thành

- [x] Anonymous không truy cập được private route.
- [x] Logout chờ Supabase hủy session rồi redirect.
- [x] Server lấy current user từ `getClaims()` đã xác minh.
- [x] Không lộ secret; browser dùng publishable key.
- [x] Test, lint, typecheck và build đạt.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/login/*`, `src/app/auth/confirm/route.ts`, `src/app/unauthorized/page.tsx`.
- `src/app/admin/page.tsx`, `src/app/app/layout.tsx`, app header/sidebar.
- `src/lib/auth/claims.ts`, `src/lib/supabase/{auth,client,server,proxy}.ts`, `src/proxy.ts`.
- `prisma/migrations/20260727170000_auth_user_mapping/migration.sql`.
- `tests/auth-claims.test.ts`, `docs/AUTHENTICATION.md`, env contract, package scripts và project-log.

### Quyết định kỹ thuật

- Proxy chỉ refresh cookie và redirect sớm; `/app`, `/admin` và mutations vẫn xác minh ở server.
- `getClaims()` bảo vệ route; `getSession()` không dùng làm nguồn authorization.
- Role admin chỉ tin `app_metadata.role`; unit test chứng minh `user_metadata.role` không cấp quyền.
- Trigger mapping nằm trong schema `private`, có `search_path` rỗng và revoke execute; migration cloud version `20260727134903`.
- Env browser chuyển từ legacy anon key sang `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` theo tài liệu Supabase hiện hành.

### Vấn đề còn lại

- Kiểm thử email confirmation, refresh và logout end-to-end bằng account thật cần cấu hình redirect URL/email của môi trường triển khai; Task 05 không tạo external credential. Luồng anonymous, role mapping, migration và server guards đã được kiểm thử không cần account thật.
- Custom SMTP/template không có trong phạm vi và có thể phát sinh dịch vụ ngoài Free Plan.

### Kiểm tra

- Prisma validate/generate: Đạt.
- Unit tests: 3/3 đạt (anonymous claim, user thường, admin app metadata).
- Lint, typecheck, build: Đạt.
- HTTP smoke-test: `/login` 200; `/app/dashboard` anonymous 307 về login và giữ query; `/unauthorized` 200.
- Supabase mapping transaction: tạo 1 User + 1 Profile rồi rollback; không để lại test data.
- Supabase Security Advisor: không có lint; performance chỉ còn INFO unused-index trên database rỗng.
