# CoffeeHub Agent — Workflows

File này chỉ định cách thực thi theo mode. Quy tắc code và Git nằm trong `RULES.md`.

## Bootstrap

Với Supabase, bootstrap chỉ chuẩn bị packages, clients/helpers và `.env.example`; không tự tạo project/bucket, lấy secret, chạy cloud migration, bật billing hoặc nâng gói.

Dùng khi project chưa thể cài đặt hoặc build.

Trình tự:

1. Bảo toàn file hiện có.
2. Xác định package manager từ lockfile; nếu chưa có thì dùng npm.
3. Khởi tạo Git và Next.js khi thực sự chưa tồn tại.
4. Cấu hình TypeScript strict, Tailwind, lint, `.gitignore`, `.env.example`.
5. Chỉ cài dependency nền tảng cần dùng ngay.
6. Không kết nối production database.
7. Chạy install, dev, lint, typecheck và build theo scripts thực tế.
8. Cập nhật Task 00 và project-log.
9. Commit, push `origin/dev`, báo cáo và dừng.

## Development

Dùng khi project đã chạy được và còn feature chưa hoàn thành.

Trình tự:

1. Đọc acceptance criteria.
2. Kiểm tra dependency.
3. Audit code và dữ liệu liên quan.
4. Chia task thành subtask nếu không thể hoàn thành an toàn trong một phiên.
5. Triển khai theo lát cắt dọc khi phù hợp:

```text
Schema/domain
→ repository/service
→ server action/API
→ UI
→ loading/empty/error
→ validation/test
```

6. Với nội dung thay đổi thường xuyên, triển khai Admin/CMS thay vì hard-code.
7. Kiểm tra, cập nhật tài liệu, commit, push và dừng.

## Maintenance

Dùng cho bugfix, refactor, performance, accessibility hoặc technical debt.

Ưu tiên:

1. Security và data integrity
2. Production-breaking bug
3. Build/type/lint/test failure
4. Functional bug
5. Accessibility/performance regression
6. Technical debt
7. Cosmetic polish

Tìm root cause, sửa tối thiểu, kiểm tra regression, cập nhật tài liệu, commit, push và dừng.

## Release

Dùng khi Task QA/Deploy đang hoạt động.

Phải review:

- build, typecheck, lint, test;
- auth và authorization;
- environment variables;
- migration và rollback;
- responsive/PWA;
- known limitations;
- deployment handoff.

Không deploy production hoặc chạy production migration nếu người dùng chưa xác nhận trực tiếp.

## Kết thúc phiên

Sau khi push thành công:

- ghi commit hash và push result;
- đề xuất task kế tiếp;
- không sửa thêm code;
- không mở task kế tiếp;
- dừng và chờ yêu cầu mới.
