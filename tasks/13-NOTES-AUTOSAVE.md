# Task 13 — Notes và autosave

## Trạng thái

Pending

## Mục tiêu

Tạo Note editor có autosave, local draft và conflict detection

## Dependency

- `12-CALENDAR.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/notes`
- **Luồng:** Tạo Note, nhập nội dung và thấy trạng thái autosave cùng dữ liệu phục hồi sau refresh.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

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
- Visible result URL: Chưa có.
- How to use: Chưa cập nhật.
- Browser desktop: Chưa chạy.
- Browser mobile: Chưa chạy.
- Manual test: Chưa chạy.
