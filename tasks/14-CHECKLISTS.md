# Task 14 — Checklists

## Trạng thái

Pending

## Mục tiêu

Chốt domain và triển khai Checklist không trùng Subtask

## Dependency

- `13-NOTES-AUTOSAVE.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/checklists hoặc màn hình entity chứa checklist`
- **Luồng:** Tạo checklist/item, tick hoàn thành và thấy tiến độ cập nhật.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

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
- Visible result URL: Chưa có.
- How to use: Chưa cập nhật.
- Browser desktop: Chưa chạy.
- Browser mobile: Chưa chạy.
- Manual test: Chưa chạy.
