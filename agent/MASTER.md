# CoffeeHub Agent — Master Controller

## Trách nhiệm

Điều phối đúng một phiên làm việc. Mỗi phiên chỉ xử lý một task hoặc một subtask rõ ràng.

## Quy trình bắt buộc

1. Đọc `MANIFEST.md`.
2. Kiểm tra repository root và `git status`.
3. Đọc:
   - `project-log/CURRENT_STATUS.md`
   - `project-log/NEXT_STEPS.md`
   - `project-log/DECISIONS.md`
   - `project-log/AI_MEMORY.md`
   - `project-log/ISSUES.md`
   - `project-log/KNOWN_LIMITATIONS.md`
   - `project-log/TECH_DEBT.md`
4. Đọc `tasks/README.md` và cấu trúc Epic → Feature → Task được `NEXT_STEPS.md` chỉ định.
5. Chọn đúng một task:
   - task đang `In Progress`; hoặc
   - task pending đầu tiên có dependency đã hoàn thành.
6. Đọc toàn bộ task đó.
7. Đọc các tài liệu trong `docs/` được task tham chiếu hoặc có liên quan trực tiếp.
8. Đọc:
   - `agent/WORKFLOWS.md`
   - `agent/RULES.md`
   - `agent/STOP_CONDITIONS.md`
9. Xác định mode.
10. Audit code liên quan trước khi sửa.
11. Triển khai đúng phạm vi task.
12. Chạy kiểm tra phù hợp.
13. Cập nhật task và project-log.
14. Commit thay đổi.
15. Push lên duy nhất `origin/dev`.
16. Báo cáo và dừng.

## Chọn task

Ưu tiên:

1. Task `In Progress`.
2. Task được chỉ định trực tiếp bởi người dùng.
3. Task đầu tiên trong `NEXT_STEPS.md` nếu dependency đã hoàn thành.
4. Lỗi build/type/lint/test đang chặn task đó.

Không tự bắt đầu task kế tiếp sau khi push.

## Vòng lặp một phiên

```text
Đọc trạng thái
→ chọn một task
→ audit
→ triển khai
→ kiểm tra
→ cập nhật tài liệu
→ commit
→ push origin/dev
→ báo cáo
→ dừng
```

## Báo cáo cuối phiên

```text
Mode:
Task:
Status:
Files changed:
Database changes:
Validation performed:
Git commit:
Push result:
Current blockers:
Documentation updated:
Recommended next task:
Reason for stopping:
```

Không khẳng định đã chạy kiểm tra, commit hoặc push nếu chưa thực sự thực hiện.


## Work hierarchy

- Epic xác định mục tiêu lớn.
- Feature xác định khả năng người dùng.
- Task là đơn vị thực hiện trong một phiên.
- Subtask là checklist trong Task.

Mỗi phiên chỉ thực hiện một Task hoặc Subtask. Các phiên thông thường phải dùng `agent/CONTINUE.md`.
