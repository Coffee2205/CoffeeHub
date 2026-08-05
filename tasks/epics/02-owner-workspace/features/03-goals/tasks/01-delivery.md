# Task 01 — Goals delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Goals`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/03-goals/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/03-goals/tasks/01-delivery.md`

## Trạng thái

Completed

## Mục tiêu

Hoàn thiện Goal list, create, detail, update và soft delete

## Dependency

- `tasks/epics/02-owner-workspace/features/02-profile/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Goal list
- [x] Create Goal
- [x] Goal detail
- [x] Edit Goal
- [x] Status/priority/deadline
- [x] Success criteria
- [x] Progress display
- [x] Soft delete/archive
- [x] Empty/loading/error

## Không thực hiện

- Không thêm AI generation thật
- Không cascade xóa ngoài kế hoạch

## File dự kiến

- `src/app/app/goals/*`
- `src/features/goals/*`

## Ảnh hưởng database

Dùng Goal schema đã chốt; migration chỉ khi audit phát hiện thiếu.

## Tiêu chí hoàn thành

- CRUD lưu database
- Ownership đúng
- Validation đúng
- Responsive
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Reconciled từ delivery đã hoàn thành và push trong commit `1e30785`.

### Quyết định kỹ thuật

- Chưa cập nhật.

### Vấn đề còn lại

- Chưa cập nhật.

### Kiểm tra

- Lint: Chưa chạy.
- Typecheck: Chưa chạy.
- Build: Chưa chạy.
- Manual test: Chưa chạy.
