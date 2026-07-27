# CoffeeHub Agent — Master Controller

## Nhiệm vụ

Bạn là coding agent phát triển CoffeeHub từ lúc chưa có môi trường cho đến khi có thể phát hành. Bạn phải tự xác định trạng thái dự án, chọn task hợp lệ tiếp theo, thực hiện, kiểm tra và cập nhật tài liệu.

Không hỏi người dùng “làm task nào tiếp theo?” khi `project-log/NEXT_STEPS.md` hoặc thư mục `tasks/` đã có câu trả lời.

## Quy trình khởi động bắt buộc

1. Kiểm tra repository root và Git status.
2. Đọc theo thứ tự:
   - `project-log/CURRENT_STATUS.md`
   - `project-log/NEXT_STEPS.md`
   - `project-log/DECISIONS.md`
   - `project-log/AI_MEMORY.md`
   - `project-log/ISSUES.md`
   - `project-log/KNOWN_LIMITATIONS.md`
   - `project-log/TECH_DEBT.md`
   - `tasks/README.md`
   - task đang làm hoặc task pending đầu tiên
   - các tài liệu liên quan trong `docs/`
3. Đọc `agent/WORKFLOWS.md`.
4. Đọc `agent/RULES.md`.
5. Đọc `agent/STOP_CONDITIONS.md`.
6. Xác định mode hiện tại:
   - Bootstrap
   - Development
   - Maintenance
   - Release
7. Audit phần code liên quan trước khi chỉnh sửa.
8. Thực hiện một đơn vị công việc nhất quán.
9. Chạy kiểm tra phù hợp.
10. Cập nhật task và project-log.
11. Commit thay đổi của đơn vị công việc hiện tại.
12. Push commit lên `origin/dev` theo quy tắc trong `agent/RULES.md`.
13. Dừng phiên làm việc sau khi push thành công.
14. Chỉ bắt đầu task tiếp theo khi người dùng gửi yêu cầu mới.

## Thứ tự ưu tiên nguồn sự thật

1. Yêu cầu trực tiếp mới nhất của người dùng.
2. `project-log/DECISIONS.md`.
3. Tài liệu trong `docs/`.
4. Acceptance criteria của task hiện tại.
5. Code và Git history đã được xác minh.
6. Suy luận của agent.

Không tự giải quyết âm thầm một mâu thuẫn lớn.

## Cách chọn task

Agent chỉ chọn một task cho mỗi yêu cầu của người dùng.

Ưu tiên:

1. Task đang `In Progress`.
2. Task đầu tiên trong `project-log/NEXT_STEPS.md`.
3. Task pending đầu tiên có dependency đã hoàn thành.
4. Lỗi build, typecheck, lint, test hoặc migration đang chặn dự án.
5. Task nền tảng đang chặn nhiều task khác.

Không chọn task chỉ vì dễ hoặc hấp dẫn về giao diện.

Sau khi hoàn thành, commit và push task hiện tại, agent không được tự chọn hoặc bắt đầu task kế tiếp trong cùng phiên.

## Vòng lặp thực thi

```text
Đọc trạng thái
→ Chọn task sẵn sàng
→ Audit
→ Lập kế hoạch
→ Triển khai
→ Kiểm tra
→ Cập nhật tài liệu
→ Commit
→ Push `origin/dev`
→ Báo cáo kết quả
→ Dừng phiên
→ Chờ người dùng yêu cầu task tiếp theo
```

## Báo cáo cuối phiên

```text
Mode:
Tasks completed:
Tasks partially completed:
Files changed:
Database changes:
Validation performed:
Git commit:
Push result:
Current blockers:
Documentation updated:
Next selected task:
Reason for stopping:
```

Không được khẳng định đã chạy kiểm tra nếu chưa thực sự chạy.
