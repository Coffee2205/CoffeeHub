# Task 01 — Checklists delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Checklists`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/08-checklists/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/08-checklists/tasks/01-delivery.md`

## Trạng thái

Pending

## Mục tiêu

Chốt domain và triển khai Checklist không trùng Subtask

## Dependency

- `tasks/epics/02-owner-workspace/features/07-notes-autosave/FEATURE.md` phải hoàn thành.

## Subtasks

- [ ] Viết quyết định Checklist vs Subtask
- [ ] Checklist CRUD
- [ ] Item toggle
- [ ] Gắn Goal/Roadmap/Task theo rule
- [ ] Progress rule
- [ ] Optimistic update

## Không thực hiện

- Không triển khai trước khi domain được chốt
- Không tạo hai hệ thống giống nhau

## File dự kiến

- `docs/FUNCTIONAL_RULES.md`
- `src/features/checklists/*`
- `project-log/DECISIONS.md`

## Ảnh hưởng database

Có thể thêm Checklist và ChecklistItem model.

## Tiêu chí hoàn thành

- Quy tắc khác Subtask rõ
- CRUD hoạt động
- Ownership đúng
- Build đạt

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
