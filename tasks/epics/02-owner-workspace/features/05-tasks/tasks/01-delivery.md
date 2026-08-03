# Task 01 — Tasks delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Tasks`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/05-tasks/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/05-tasks/tasks/01-delivery.md`

## Trạng thái

In Progress

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
- [ ] Subtask chỉ khi domain đã chốt

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
- Quan hệ Goal/Roadmap/Stage được kiểm tra theo cùng user và đúng chuỗi trong transaction.
- Toggle hoàn thành cập nhật optimistic và trả lại trạng thái trước khi action lỗi.

### Vấn đề còn lại

- Browser E2E desktop/mobile đang bị chặn: Supabase Auth từ chối `E2E_ADMIN_PASSWORD` hiện có dù email tồn tại và role là admin.

### Kiểm tra

- Lint: Đạt.
- Typecheck: Đạt.
- Tests: Đạt 51/51.
- Build: Đạt; các route `/app/tasks`, `/app/tasks/new`, `/app/tasks/[taskId]` được tạo.
- Manual test: Chưa đạt do blocker credential; không tuyên bố browser pass.
