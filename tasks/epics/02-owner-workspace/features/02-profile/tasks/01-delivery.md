# Task 01 — Workspace Profile delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Workspace Profile`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/02-profile/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/02-profile/tasks/01-delivery.md`

## Trạng thái

Completed — 2026-08-02

## Mục tiêu

Tạo khu vực quản lý hồ sơ cá nhân và quyền công khai dữ liệu

## Dependency

- `tasks/epics/01-public-cv-cms/features/01-admin-content-management/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Profile overview
- [x] Education CRUD
- [x] Skills CRUD
- [x] Experience CRUD
- [x] Projects CRUD
- [x] Public visibility controls
- [x] Validation và ownership

## Không thực hiện

- Không public mặc định dữ liệu nhạy cảm
- Không tạo thông tin giả

## File dự kiến

- `src/app/app/profile/*`
- `src/features/profile/*`

## Ảnh hưởng database

Có thể thêm các model profile liên quan và migration.

## Tiêu chí hoàn thành

- CRUD hoạt động
- Ownership đúng
- Public flag rõ ràng
- Responsive
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/app/profile/page.tsx`: thêm snapshot nội dung hồ sơ, số record public và CTA quản lý theo quyền.
- `src/features/profile/workspace-profile.repository.ts`: đọc Profile, Experience, Skill, Education và Project theo đúng `userId`, bỏ record soft-deleted.

### Quyết định kỹ thuật

- Tái sử dụng CRUD Admin/CMS đã hoàn thành thay vì tạo luồng chỉnh sửa trùng lặp trong workspace.
- `/app/profile` là overview riêng của owner; CTA mutation chỉ hiển thị cho Admin, còn public visibility tiếp tục dùng `DRAFT`/`PUBLISHED`/`HIDDEN`.
- Không cần migration mới; schema profile và content ownership hiện có đã đáp ứng Task.

### Vấn đề còn lại

- Không còn hạng mục nào trong Task 01.

### Kiểm tra

- Test: Đạt 41/41 (`npm test`).
- Lint: Đạt (`npm run lint`).
- Typecheck: Đạt (`npm run typecheck`).
- Build: Đạt (`npm run build`, Prisma generate + Next.js production build).
- Manual test: Đạt tại `/app/profile` với owner/Admin; desktop 1440×1000 và mobile 390×844 hiển thị snapshot/CTA, không overflow, overlay hoặc browser error.
