# Task 01 — Notes and Autosave delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Notes and Autosave`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/07-notes-autosave/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/07-notes-autosave/tasks/01-delivery.md`

## Trạng thái

Pending

## Mục tiêu

Tạo Note editor có autosave, local draft và conflict detection

## Dependency

- `tasks/epics/02-owner-workspace/features/06-calendar/FEATURE.md` phải hoàn thành.

## Subtasks

- [ ] Note list/editor
- [ ] Debounce 800–1200ms
- [ ] Không save lần render đầu
- [ ] Save status
- [ ] IndexedDB draft
- [ ] Retry
- [ ] Version conflict UI
- [ ] Khôi phục draft

## Không thực hiện

- Không làm collaborative editing
- Không âm thầm overwrite conflict

## File dự kiến

- `src/app/app/notes/*`
- `src/features/notes/*`
- `src/features/sync/*`

## Ảnh hưởng database

Note cần version và timestamps; migration nếu thiếu.

## Tiêu chí hoàn thành

- Autosave không spam request
- Offline draft hoạt động
- Conflict được phát hiện
- Trạng thái rõ
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
