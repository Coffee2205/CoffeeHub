# Task 01 — Tasks delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Tasks`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/05-tasks/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/05-tasks/tasks/01-delivery.md`

## Trạng thái

Completed

## Mục tiêu

Hoàn thiện Task CRUD và thao tác nhanh

## Dependency

- `tasks/epics/02-owner-workspace/features/04-roadmaps/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Task list
- [x] Create/edit/detail
- [x] Status/priority/deadline
- [x] Goal và Stage relation
- [x] Optimistic toggle
- [x] Rollback lỗi
- [x] Filter/search
- [x] Không tạo Subtask/checklist trùng khi domain chưa chốt

## Không thực hiện

- Không làm notification scheduling
- Không triển khai checklist trùng lặp

## File dự kiến

- `src/app/app/tasks/*`
- `src/features/tasks/*`

## Ảnh hưởng database

Có thể thêm index/filter fields.

## Tiêu chí hoàn thành

- CRUD hoạt động
- Optimistic update rollback đúng
- Không tạo relation khác user
- Responsive
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/app/tasks/*`
- `src/features/tasks/*`
- `tests/task-schema.test.ts`

### Quyết định kỹ thuật

- Server Components đọc dữ liệu owner-scoped; mọi Server Action xác thực lại user.
- Quan hệ Goal/Roadmap/Stage được kiểm tra theo cùng owner và đúng chuỗi trong transaction trước khi ghi.
- Toggle cập nhật optimistic, rollback khi action lỗi, kết thúc pending trước khi refresh Server Component.
- Không thêm schema/migration vì Task model, relation, constraint và index hiện có đã đáp ứng.

### Vấn đề còn lại

- Không có blocker. Bản ghi E2E đã được archive qua UI và không còn trong danh sách active.

### Kiểm tra

- Lint: Đạt (`npm run lint`).
- Typecheck: Đạt (`npm run typecheck`).
- Tests: Đạt 51/51 (`npm test`).
- Build: Đạt (`npm run build`).
- Manual test: Đạt owner CRUD, status/priority/deadline, search/filter, optimistic toggle và archive trên desktop 1440×1000; mobile 390×844 không overflow/error overlay.
