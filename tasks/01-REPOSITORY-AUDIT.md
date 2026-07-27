# Task 01 — Audit repository

## Trạng thái

Pending

## Mục tiêu

Xác định chính xác trạng thái code hiện tại trước khi thay đổi lớn.

## Dependency

- `00-BOOTSTRAP.md` phải hoàn thành.

## Công việc

- [ ] Đọc toàn bộ cấu trúc thư mục và file hướng dẫn agent.
- [ ] Đọc `package.json`, lockfile và scripts.
- [ ] Xác nhận phiên bản Next.js, React, TypeScript, Tailwind, Prisma và auth.
- [ ] Kiểm tra App Router hoặc Pages Router.
- [ ] Đọc schema Prisma, migrations và seed nếu tồn tại.
- [ ] Liệt kê route và feature đã có.
- [ ] Kiểm tra cách bảo vệ private route và ownership.
- [ ] Chạy lint, typecheck và build nếu không phá dữ liệu.
- [ ] Tạo `docs/REPOSITORY_AUDIT.md`.
- [ ] Cập nhật project-log theo kết quả thực tế.

## Không thực hiện

- Không viết lại source.
- Không xóa code cũ.
- Không cài dependency.
- Không chạy migration production.

## File dự kiến

- `docs/REPOSITORY_AUDIT.md`
- `project-log/CURRENT_STATUS.md`
- `project-log/NEXT_STEPS.md`
- `project-log/ISSUES.md`
- `project-log/CHANGELOG.md`

## Ảnh hưởng database

Không thay đổi schema. Chỉ đọc và báo cáo.

## Tiêu chí hoàn thành

- Báo cáo phân biệt rõ phần đã xác minh và phần suy luận.
- Có danh sách chức năng giữ lại, cần sửa và có thể xóa.
- Có kết quả kiểm tra thực tế.
- Xác định task tiếp theo, ghi vào `project-log/NEXT_STEPS.md`, sau đó commit, push và dừng.

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
