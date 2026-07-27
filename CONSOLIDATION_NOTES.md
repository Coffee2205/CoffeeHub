# Consolidation Notes

## Đã giữ lại

- Toàn bộ tài liệu sản phẩm và kỹ thuật trong `docs/`.
- Roadmap task chi tiết.
- Project log cần thiết.
- Cơ chế agent tự động Bootstrap → Development → Maintenance → Release.

## Đã chỉnh sửa

- Thêm `tasks/00-BOOTSTRAP.md`.
- Đánh lại số toàn bộ task cũ tăng thêm 1.
- Cập nhật task roadmap để agent được tự chuyển task.
- Cập nhật Current Status và Next Steps cho trạng thái chưa cấu hình môi trường.
- Chuẩn hóa rule AI, database, autosave, Git và tài liệu.

## Đã xóa hoặc hợp nhất

- Xóa `project-log/AGENT_PROMPT_TEMPLATE.md` vì yêu cầu người dùng điền task thủ công và mâu thuẫn với workflow tự động.
- Hợp nhất `BOOTSTRAP.md`, `DEVELOPMENT.md`, `MAINTENANCE.md`, `RELEASE.md`, `DECISION_TREE.md` thành `agent/WORKFLOWS.md`.
- Hợp nhất `CODING_RULES.md`, `DOCUMENTATION_RULES.md`, `GIT_RULES.md`, `AI_RULES.md` thành `agent/RULES.md`.
- Hợp nhất sáu checklist nhỏ thành `agent/QUALITY_CHECKLIST.md`.
- Chỉ giữ một bộ `CURRENT_STATUS`, `NEXT_STEPS`, `DECISIONS`, `ISSUES` và `CHANGELOG`.


## Cập nhật chính sách Git

- Agent tự commit sau mỗi task hoặc subtask hoàn chỉnh có thay đổi code.
- Agent tự push lên duy nhất `origin/dev`.
- Agent không push lên `main`, không force push và không tự resolve conflict không rõ nguồn gốc.
- Khi thiếu remote, credential hoặc quyền truy cập, agent dừng và báo người dùng.


## Cập nhật điều khiển phiên

- Agent chỉ thực hiện một task hoặc subtask cho mỗi yêu cầu.
- Sau khi push thành công lên `origin/dev`, agent phải dừng.
- Agent chỉ đề xuất task tiếp theo, không tự triển khai.
