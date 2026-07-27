# CoffeeHub Agent — Điều kiện bắt buộc dừng

Dừng và hỏi người dùng khi cần:

- Chọn giữa nhiều hướng product/UX ảnh hưởng đáng kể.
- Xóa bảng/cột hoặc migration có nguy cơ mất dữ liệu.
- Chạy migration production.
- Bật billing, mua dịch vụ hoặc dùng API trả phí.
- Cung cấp secret, OAuth credential hoặc tài khoản ngoài.
- Đổi framework, database, ORM, auth provider hoặc kiến trúc repository.
- Public dữ liệu trước đây là private.
- Thay đổi permission model nhạy cảm.
- Force push, reset, rewrite history hoặc xóa thay đổi người dùng.
- Push cần credential mới, remote không tồn tại hoặc quyền truy cập bị từ chối.
- Rebase hoặc pull `origin/dev` tạo conflict.
- Giải quyết merge conflict không rõ quyền sở hữu.
- Deploy production.
- Tài liệu và code mâu thuẫn nghiêm trọng.
- Không thể xác minh do thiếu quyền hoặc môi trường.

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
