# Tasks — CoffeeHub

Các task được thực hiện theo dependency. Agent tự chọn task `In Progress` hoặc task pending đầu tiên đã sẵn sàng.

## Thứ tự mặc định

1. `00-BOOTSTRAP.md`
2. `01-REPOSITORY-AUDIT.md`
3. `02-DESIGN-FOUNDATION.md`
4. `03-APP-SHELL.md`
5. `04-AUTHENTICATION.md`
6. `05-DATABASE-FOUNDATION.md`
7. `06-DASHBOARD.md`
8. `07-PROFILE.md`
9. `08-GOALS.md`
10. `09-ROADMAPS.md`
11. `10-TASKS.md`
12. `11-CALENDAR.md`
13. `12-NOTES-AUTOSAVE.md`
14. `13-CHECKLISTS.md`
15. `14-NOTIFICATIONS.md`
16. `15-PWA-OFFLINE.md`
17. `16-PUBLIC-LANDING.md`
18. `17-AI-FOUNDATION.md`
19. `18-AI-GOAL-ASSISTANT.md`
20. `19-AI-PERSONAL-ASSISTANT.md`
21. `20-QA-DEPLOY.md`

## Trạng thái hợp lệ

- `Pending`
- `In Progress`
- `Blocked`
- `Completed`

## Quy tắc

- Task 00 Bootstrap phải hoàn thành trước Repository Audit nếu project chưa được cấu hình.
- Agent được tự động chuyển sang task kế tiếp khi không gặp điều kiện bắt buộc dừng.
- Không làm task phase sau khi dependency chưa hoàn thành.
- Task lớn phải được chia thành subtasks có thể kiểm tra.
- Không đánh dấu `Completed` nếu acceptance criteria chưa đạt.
- Mỗi task phải cập nhật phần Kết quả thực hiện.
- Sau mỗi đơn vị công việc phải cập nhật project-log.
- Thay đổi database phải ghi migration, rủi ro và rollback.
- Package mới phải có lý do sử dụng thực tế.
- Không thêm dịch vụ trả phí khi chưa được xác nhận.
