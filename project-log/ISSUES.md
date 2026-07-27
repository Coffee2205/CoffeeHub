# Issues

## I-001 — Task files trùng số

- Trạng thái: Open, không chặn Task 02.
- `tasks/README.md` định nghĩa roadmap mới từ Task 00 đến Task 21, nhưng filesystem vẫn có một số file task cũ trùng số.
- `REVIEW_REPORT.md` nói các file cũ đã được xóa, không khớp trạng thái repository thực tế.
- Task 00 không xóa file vì yêu cầu bảo toàn dữ liệu hiện có.
- Task 01 đã xác minh `tasks/README.md` là roadmap canonical và liệt kê 16 file legacy trong `docs/REPOSITORY_AUDIT.md`.
- Hành động đề xuất: tạo task/subtask cleanup riêng trước khi xóa; không trộn việc xóa vào feature task.

## I-002 — Dependency advisories

- Trạng thái: Open, không chặn bootstrap local.
- `npm audit --omit=dev` trong Task 01 xác định 3 advisory production-transitive qua `postcss` và `sharp` của Next.js 16.2.12.
- Không chạy `npm audit fix --force` vì có nguy cơ thay đổi dependency phá vỡ.
