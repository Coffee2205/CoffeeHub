# Tasks — CoffeeHub

## Cách chọn task

Mỗi phiên chỉ thực hiện một task hoặc một subtask.

Agent chọn:

1. task `In Progress`;
2. task người dùng chỉ định;
3. task pending đầu tiên có dependency hoàn thành.

## Roadmap mặc định

1. `00-BOOTSTRAP.md`
2. `01-REPOSITORY-AUDIT.md`
3. `02-DESIGN-FOUNDATION.md`
4. `03-APP-SHELL.md`
5. `04-DATABASE-FOUNDATION.md`
6. `05-AUTHENTICATION.md`
7. `06-DASHBOARD.md`
8. `07-ADMIN-CONTENT-MANAGEMENT.md`
9. `08-PROFILE.md`
10. `09-GOALS.md`
11. `10-ROADMAPS.md`
12. `11-TASKS.md`
13. `12-CALENDAR.md`
14. `13-NOTES-AUTOSAVE.md`
15. `14-CHECKLISTS.md`
16. `15-NOTIFICATIONS.md`
17. `16-PWA-OFFLINE.md`
18. `17-PUBLIC-LANDING.md`
19. `18-AI-FOUNDATION.md`
20. `19-AI-GOAL-ASSISTANT.md`
21. `20-AI-PERSONAL-ASSISTANT.md`
22. `21-QA-DEPLOY.md`

## Trạng thái hợp lệ

- `Pending`
- `In Progress`
- `Blocked`
- `Completed`

## Quy tắc dependency

- Không làm task khi dependency chưa hoàn thành.
- Nếu task quá lớn, tạo subtasks trong chính task hoặc file task mới.
- Sau khi push, agent dừng; không tự chuyển sang task tiếp theo.
- `NEXT_STEPS.md` chỉ đề xuất task, không tự kích hoạt việc triển khai.

## Quy tắc Content-first

Nội dung có khả năng thay đổi sau bàn giao không được hard-code.

Task thêm loại nội dung mới phải xác định rõ:

- code constant;
- site setting;
- CMS entity;
- feature flag.

Nếu là site setting hoặc CMS entity, task phải bao gồm:

- schema;
- validation;
- CRUD;
- authentication/authorization;
- giao diện quản trị;
- trạng thái publish nếu công khai;
- kết nối phần hiển thị;
- migration và rollback khi có thay đổi database.

## Hoàn thành task

Task chỉ được đánh dấu `Completed` khi:

- acceptance criteria đạt;
- kiểm tra đã chạy hoặc giới hạn được ghi rõ;
- task và project-log đã cập nhật;
- commit đã tạo;
- push lên `origin/dev` thành công.

Nếu push bị chặn, task giữ `In Progress` hoặc `Blocked` tùy nguyên nhân.
