# Task 10 — Roadmaps

## Trạng thái

Pending

## Mục tiêu

Tạo Roadmap và Stage gắn với Goal

## Dependency

- `09-GOALS.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/goals/[goalId]/roadmap`
- **Luồng:** Thêm/sắp xếp milestone cho một Goal và xem tiến độ cập nhật.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

- [ ] Create Roadmap
- [ ] Stage CRUD
- [ ] Reorder stage
- [ ] Milestone/status
- [ ] Task relation placeholder hoặc thật
- [ ] Progress calculation
- [ ] Mobile layout

## Không thực hiện

- Không tạo AI roadmap
- Không xóa Task khi xóa stage nếu chưa có rule

## File dự kiến

- `src/app/app/roadmaps/*`
- `src/features/roadmaps/*`

## Ảnh hưởng database

Có thể điều chỉnh relation/order constraint.

## Tiêu chí hoàn thành

- Stage order ổn định
- Transaction khi cần
- Ownership đúng
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
