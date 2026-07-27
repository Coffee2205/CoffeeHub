# Markdown Review Report

## Phạm vi

Đã rà soát toàn bộ file Markdown trong bộ kit sau khi tái cấu trúc.

## Kết quả kiểm tra cấu trúc

- Số task triển khai: 22.
- Không có task trùng số.
- Heading của mọi task khớp với tên file.
- Không có tham chiếu Markdown nội bộ bị thiếu, ngoại trừ `docs/REPOSITORY_AUDIT.md` là artifact được Task 01 tạo khi chạy.
- Không còn chỉ dẫn tự động bắt đầu task kế tiếp sau khi push.
- Roadmap kết thúc tại Task 21.

## Các lỗi đã sửa

- Xóa task `03-CONTENT-MANAGEMENT.md` bị trùng số với App Shell.
- Tạo lại Content Management thành `07-ADMIN-CONTENT-MANAGEMENT.md`.
- Đặt Database Foundation trước Authentication.
- Đánh lại số tất cả task phía sau một cách liên tục.
- Sửa tham chiếu AI Foundation từ Task 16 sang Task 18.
- Sửa Task Repository Audit để ghi task tiếp theo rồi dừng, thay vì tự tiếp tục.
- Xóa `QUALITY_CHECKLIST.md` vì trùng với task acceptance criteria và template.
- Xóa `CONSOLIDATION_NOTES.md` vì chỉ là lịch sử chỉnh sửa, không có chức năng vận hành.

## Phân tách trách nhiệm

- `MANIFEST.md`: bản đồ và nguồn sự thật.
- `agent/MASTER.md`: điều phối một phiên.
- `agent/WORKFLOWS.md`: cách thực thi theo mode.
- `agent/RULES.md`: quy tắc code, CMS, database, AI và Git.
- `agent/STOP_CONDITIONS.md`: điều kiện bắt buộc dừng.
- `docs/`: yêu cầu sản phẩm và thiết kế.
- `tasks/`: phạm vi triển khai.
- `project-log/`: trạng thái thực tế và lịch sử.

## Content Management

Yêu cầu chỉnh sửa nội dung không cần code được liên kết qua ba tầng:

1. `docs/CONTENT_REQUIREMENTS.md`: xác định nội dung phải quản trị được.
2. `agent/RULES.md`: cấm hard-code nội dung biên tập và định nghĩa Content-first.
3. `tasks/07-ADMIN-CONTENT-MANAGEMENT.md`: triển khai schema, CRUD, Admin UI, media, publish và kết nối phần hiển thị.

## Thống kê

- Entry/review files: 4.
- Agent control files: 4.
- Product/technical docs: 11.
- Task files, gồm README và template: 24.
- Project-log files: 9.

## Giới hạn của review

Review này xác minh tính nhất quán của tài liệu. Repository, dependency, database và build thực tế vẫn phải được kiểm tra trong Task 00 và Task 01.
