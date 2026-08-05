# Task 01 — Repository Audit delivery

## Hierarchy

- Epic: `Foundation`
- Feature: `Repository Audit`
- Source roadmap item: `tasks/epics/00-foundation/features/01-repository-audit/FEATURE.md`
- Task path: `tasks/epics/00-foundation/features/01-repository-audit/tasks/01-delivery.md`

## Trạng thái

Completed

## Mục tiêu

Xác định chính xác trạng thái code hiện tại trước khi thay đổi lớn.

## Dependency

- `tasks/epics/00-foundation/features/00-bootstrap/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Đọc toàn bộ cấu trúc thư mục và file hướng dẫn agent.
- [x] Đọc `package.json`, lockfile và scripts.
- [x] Xác nhận phiên bản Next.js, React, TypeScript, Tailwind, Prisma và auth.
- [x] Kiểm tra App Router hoặc Pages Router.
- [x] Đọc schema Prisma, migrations và seed nếu tồn tại.
- [x] Liệt kê route và feature đã có.
- [x] Kiểm tra cách bảo vệ private route và ownership.
- [x] Chạy lint, typecheck và build nếu không phá dữ liệu.
- [x] Tạo `docs/REPOSITORY_AUDIT.md`.
- [x] Cập nhật project-log theo kết quả thực tế.

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

- Tạo `docs/REPOSITORY_AUDIT.md`.
- Cập nhật Task 01 và các project-log liên quan.

### Quyết định kỹ thuật

- Giữ source hiện tại; audit không viết lại ứng dụng hoặc cài dependency.
- Dùng `tasks/README.md` làm danh sách task canonical.
- Chỉ liệt kê artifact legacy là ứng viên cleanup, không tự xóa.

### Vấn đề còn lại

- Chưa có Prisma, database, auth, ownership, PWA hoặc feature domain.
- Có 3 high advisory production-transitive trong dependency của Next.js.
- Có 16 file task legacy trùng với roadmap đã đánh số lại.

### Kiểm tra

- Lint: `npm run lint` thành công.
- Typecheck: `npm run typecheck` thành công.
- Build: `npm run build` thành công.
- Manual test: Dev server trả HTTP 200 cho `/`, nội dung CoffeeHub được xác nhận và server đã dừng.
- Audit: `npm audit --omit=dev` báo 3 high advisory production-transitive.
- Commit: `7b3a746` (`docs(repository): audit current application state`).
- Push: Chuẩn bị push lên `origin/dev` trong phiên Task 01.
