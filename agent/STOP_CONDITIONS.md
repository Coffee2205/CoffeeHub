# CoffeeHub Agent — Mandatory Stop Conditions

Dừng và hỏi người dùng khi cần:

- quyết định product/UX lớn có nhiều hướng hợp lệ;
- xóa bảng, cột hoặc dữ liệu;
- production migration;
- bật billing hoặc dịch vụ trả phí;
- secret, OAuth credential hoặc tài khoản ngoài;
- đổi framework, database, ORM, auth provider hoặc kiến trúc nền;
- public dữ liệu đang private;
- thay đổi permission model nhạy cảm;
- force push, reset hoặc rewrite history;
- giải quyết merge/rebase conflict không rõ quyền sở hữu;
- push cần credential mới, remote không tồn tại hoặc quyền bị từ chối;
- production deploy;
- tài liệu và code mâu thuẫn nghiêm trọng;
- không thể xác minh do thiếu quyền hoặc môi trường.

Mẫu báo cáo:

```text
Blocked task:
Reason:
What was verified:
Available options:
Recommended option:
Files changed:
Rollback instructions:
```
