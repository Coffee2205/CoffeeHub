# Task 09 — Goals

## Trạng thái

Completed

## Mục tiêu

Hoàn thiện Goal list, create, detail, update và soft delete

## Dependency

- `08-PROFILE.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/goals`
- **Luồng:** Tạo một Goal, xem danh sách/chi tiết và thấy dữ liệu vẫn còn sau refresh.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

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

- `src/app/app/goals/*`.
- `src/features/goals/*`.
- `tests/goal-schema.test.ts`.

### Quyết định kỹ thuật

- Progress được tính từ Task chưa xóa và không bị hủy; khi chưa có Task, tiến độ là 0% thay vì dữ liệu giả.
- Mọi query/mutation đều scope bằng verified `userId`; update/archive dùng điều kiện ownership trong chính câu lệnh persistence.
- Archive là soft delete có xác nhận, không cascade xóa Roadmap hoặc Task liên quan.

### Vấn đề còn lại

- Roadmap/Task creation từ Goal thuộc Task 10/11; Task 09 chỉ hiển thị số relation và nguồn progress hiện có.

### Kiểm tra

- Tests: Đạt, 37/37.
- Prisma generate: Đạt.
- Lint: Đạt.
- Typecheck: Đạt.
- Build: Đạt; `/app/goals`, `/app/goals/new`, `/app/goals/[goalId]` có trong production build.
- Visible result URL: `/app/goals`.
- How to use: Đăng nhập, mở Mục tiêu, chọn “Tạo Goal”, nhập thông tin và lưu; mở card để xem/sửa hoặc lưu trữ.
- Browser desktop: Đạt ở 1440×1000; empty state, form, detail và persistence hoạt động, không error overlay/overflow.
- Browser mobile: Đạt ở 390×844; detail/form responsive, bottom navigation đúng, không error overlay/overflow.
- Manual test: Đạt create → detail → refresh → update → archive với database development thật.
