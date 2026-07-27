# Changelog

## Bootstrap Next.js application

- Khởi tạo Next.js 16 App Router với React 19 và TypeScript strict.
- Cấu hình Tailwind CSS 4, ESLint 9, npm scripts và Turbopack repository root.
- Thêm app shell tối thiểu, `.env.example`, `.gitignore` và hướng dẫn chạy local.
- Xác minh install, lint, typecheck, production build và dev HTTP smoke test.
- Ghi nhận advisory dependency hiện chưa có bản sửa tương thích; không áp dụng audit fix phá vỡ.
- Git commit: Sẽ được ghi sau khi tạo commit bootstrap.
- Push: Chưa thực hiện.

## Initial documentation consolidation

- Hợp nhất Agent Kit và Agent OS.
- Xóa prompt thủ công trùng lặp.
- Hợp nhất các workflow và rule nhỏ thành bộ file điều phối duy nhất.
- Thêm Bootstrap làm task đầu tiên.
- Chuẩn hóa task roadmap và project-log.


## Automatic dev push policy

- Bật tự động commit sau mỗi đơn vị code hoàn chỉnh.
- Bật tự động push lên `origin/dev`.
- Thêm guard chống force push, push nhầm branch và tự resolve conflict.


## Stop-after-push policy

- Giới hạn mỗi phiên ở một task hoặc một subtask.
- Agent dừng ngay sau khi push thành công lên `origin/dev`.
- Task tiếp theo chỉ bắt đầu khi có yêu cầu mới từ người dùng.
