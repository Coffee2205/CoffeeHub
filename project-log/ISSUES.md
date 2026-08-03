# Issues

## I-004 — Roadmaps verification environment unavailable

- Trạng thái: Open; chặn việc đánh dấu Roadmaps delivery là Completed, không chặn commit implementation.
- Browser CLI mở được `/login` một lần nhưng sau submit mất kênh CDP; các session tiếp theo treo hoặc trả `CDP response channel closed` dù production server trả HTTP 200.
- Transaction rollback kiểm tra Supabase development đã được cấp network access nhưng không phản hồi và được dừng để tránh treo phiên.
- Remediation: khởi động lại browser automation runtime, xác minh desktop/mobile và chạy lại create/reorder transaction hoặc luồng UI với database development.

## I-003 — Supabase leaked-password protection disabled

- Trạng thái: Open; không chặn Development hoặc Task 07C4, cần xử lý trước Release.
- Supabase Security Advisor ngày 2026-08-02 báo Auth chưa bật kiểm tra mật khẩu bị rò rỉ qua HaveIBeenPwned.
- Remediation: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## I-002 — Next.js transitive dependency advisories

- Trạng thái: Open; không chặn development hiện tại, cần đánh giá lại trước release.
- `npm audit --omit=dev` ngày 2026-07-27 còn 3 high advisory thuộc `next` qua `postcss` và `sharp`.
- Nhánh Prisma đã được xử lý bằng bản vá đồng bộ `7.9.1` và không còn xuất hiện trong production audit.
- npm chỉ đề xuất hạ Next.js xuống `9.3.3`; đây là thay đổi phá vỡ App Router/React hiện tại nên không áp dụng và không chạy `audit fix --force`.
- Theo dõi bản vá upstream, sau đó nâng cấp trong maintenance task có đầy đủ regression test.
