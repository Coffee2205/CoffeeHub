# User Flows — CoffeeHub

## 1. Đăng nhập và vào workspace

```text
Người dùng mở website
→ Chọn Login
→ Nhập thông tin
→ Backend xác thực
→ Tạo session
→ Chuyển đến /app/dashboard
```

Trường hợp lỗi:

- Sai thông tin: giữ nguyên form và hiển thị lỗi rõ ràng.
- Session hết hạn: chuyển về login và giữ đường dẫn dự định nếu phù hợp.
- Không có quyền: không hiển thị dữ liệu.

## 2. Tạo Goal thủ công

```text
Goals
→ New Goal
→ Nhập title, mô tả, deadline, priority, success criteria
→ Validate
→ Save
→ Mở Goal Detail
```

Sau khi tạo:

- Goal xuất hiện trên Dashboard nếu đang active.
- Có thể thêm Roadmap, Task hoặc Checklist.
- Tạo audit/event history nếu hệ thống có history.

## 3. Tạo Roadmap từ Goal

```text
Goal Detail
→ Create Roadmap
→ Thêm các stage
→ Sắp xếp thứ tự
→ Save transaction
→ Hiển thị roadmap trong Goal
```

Không được tạo roadmap thuộc Goal của user khác.

## 4. Toggle Task

```text
Người dùng chọn checkbox
→ UI cập nhật ngay
→ Gửi mutation với version/idempotency key nếu cần
→ Backend validate quyền
→ Lưu database
→ Thành công: giữ trạng thái
→ Thất bại: rollback và báo lỗi
```

## 5. Autosave Note

```text
Mở Note
→ Người dùng nhập
→ Lưu local draft
→ Chờ ngừng nhập 800–1200ms
→ Hiển thị Saving
→ Gửi content + current version
→ Backend kiểm tra version
→ Save
→ Trả version mới
→ Hiển thị Saved
```

Nếu offline:

```text
Lưu IndexedDB
→ Hiển thị Offline — queued
→ Có mạng trở lại
→ Sync queue
→ Nếu không conflict: save
→ Nếu conflict: yêu cầu người dùng xử lý
```

## 6. Tạo Event và Reminder

```text
Calendar
→ New Event
→ Nhập thời gian và recurrence
→ Chọn reminder
→ Save event
→ Tạo hoặc cập nhật reminder schedule
```

Khi thời gian event thay đổi, reminder cũ phải được thay thế hoặc cập nhật.

## 7. AI phân tích Goal

```text
Goal Detail
→ Analyze with AI
→ Backend lấy đúng context cần thiết
→ Gửi provider ưu tiên
→ Validate response
→ Hiển thị analysis
→ Người dùng có thể lưu analysis thành Note hoặc bỏ qua
```

Analysis không được tự động sửa Goal.

## 8. AI tạo Goal và Roadmap

```text
AI Assistant
→ Người dùng mô tả mục tiêu
→ AI trả structured proposal
→ Backend validate
→ Hiển thị Goal + Roadmap + Task draft
→ Người dùng chỉnh sửa
→ Confirm
→ Service transaction lưu dữ liệu
→ Audit log
→ Hiển thị kết quả và Undo nếu hỗ trợ
```

Không lưu trước khi confirm đối với Goal, Roadmap hoặc batch Task.

## 9. AI provider fallback

```text
Gửi OpenAI
→ Thành công: dùng kết quả
→ Quota/rate-limit/timeout/unavailable: thử Groq
→ Lỗi tương tự: thử Gemini
→ Validate output
→ Tạo proposal
```

Không fallback khi:

- Prompt không hợp lệ.
- Người dùng không có quyền.
- Output vi phạm schema sau số lần retry cho phép.
- Yêu cầu bị từ chối vì quy tắc an toàn.

## 10. Đăng xuất

```text
Settings hoặc User Menu
→ Logout
→ Hủy session
→ Xóa dữ liệu cache nhạy cảm phù hợp
→ Chuyển về public website hoặc login
```
