# Task 11 — Tasks

## Trạng thái

Pending

## Mục tiêu

Hoàn thiện Task CRUD và thao tác nhanh

## Dependency

- `10-ROADMAPS.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/tasks`
- **Luồng:** Tạo, sửa trạng thái và lọc Task; thay đổi hiển thị ngay và tồn tại sau refresh.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

- [ ] Task list
- [ ] Create/edit/detail
- [ ] Status/priority/deadline
- [ ] Goal và Stage relation
- [ ] Optimistic toggle
- [ ] Rollback lỗi
- [ ] Filter/search
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

- Chưa cập nhật.

### Quyết định kỹ thuật

- Chưa cập nhật.

### Vấn đề còn lại

- Chưa cập nhật.

### Kiểm tra

- Lint: Chưa chạy.
- Typecheck: Chưa chạy.
- Build: Chưa chạy.
- Visible result URL: Chưa có.
- How to use: Chưa cập nhật.
- Browser desktop: Chưa chạy.
- Browser mobile: Chưa chạy.
- Manual test: Chưa chạy.
