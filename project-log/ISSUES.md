# Issues

## I-001 — Task files trùng số

- Trạng thái: Open.
- `tasks/README.md` định nghĩa roadmap mới từ Task 00 đến Task 21, nhưng filesystem vẫn có một số file task cũ trùng số.
- `REVIEW_REPORT.md` nói các file cũ đã được xóa, không khớp trạng thái repository thực tế.
- Task 00 không xóa file vì yêu cầu bảo toàn dữ liệu hiện có.
- Hành động đề xuất: Task 01 xác minh file canonical theo manifest/roadmap và lập danh sách file legacy trước khi xóa hoặc di chuyển.

## I-002 — Dependency advisories

- Trạng thái: Open, không chặn bootstrap local.
- `npm install` báo 12 advisory high; audit trước đó xác định 3 advisory production-transitive qua Next.js.
- Không chạy `npm audit fix --force` vì có nguy cơ thay đổi dependency phá vỡ.
