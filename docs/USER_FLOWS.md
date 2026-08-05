# User Flows — CoffeeHub

## 1. Khách xem CV/portfolio

```text
Khách mở /
→ xem thông tin cá nhân đã publish
→ xem kinh nghiệm, kỹ năng, học vấn và dự án
→ mở chi tiết dự án hoặc bài viết
→ dùng CTA liên hệ/GitHub/LinkedIn/CV
```

Không yêu cầu:

- đăng ký;
- đăng nhập;
- guest account;
- demo credential.

Draft, hidden, soft-deleted và dữ liệu workspace không xuất hiện.

## 2. Owner đăng nhập và vào workspace

```text
Owner mở /login
→ nhập email/password
→ Supabase Auth xác thực
→ server tạo/xác minh session
→ chuyển đến next hợp lệ hoặc /app/dashboard
```

Owner không cần đăng nhập bằng account khác để xem CV. Sau khi đăng nhập, owner sử dụng toàn bộ chức năng cá nhân và có link xem/quản lý CV.

## 3. Owner quản lý nội dung CV

```text
/app hoặc /admin
→ Manage CV
→ chỉnh Profile/Project/Experience/Skill/Education/Post
→ Save Draft
→ Preview
→ Publish
→ nội dung xuất hiện trên public route
```

Không cần sửa source code, Prisma Studio, SQL Editor hoặc Supabase Dashboard.

## 4. Owner xem public CV sau khi chỉnh

```text
Admin publish
→ mở / hoặc /admin/preview
→ xác minh nội dung public
```

Owner mở `/` vẫn thấy CV công khai; session chỉ bổ sung CTA vào Dashboard/Manage CV, không thay tên hiển thị bằng email đăng nhập.

## 5. Tạo Goal thủ công

```text
/app/goals
→ New Goal
→ nhập thông tin
→ validate
→ save
→ mở Goal Detail
```

## 6. Tạo Roadmap từ Goal

```text
Goal Detail
→ Create Roadmap
→ thêm stages
→ reorder
→ save transaction
→ hiển thị roadmap
```

## 7. Toggle Task

```text
Chọn checkbox
→ optimistic update
→ mutation có auth/ownership
→ success giữ trạng thái
→ failure rollback và báo lỗi
```

## 8. Autosave Note

```text
Mở Note
→ nhập
→ local draft
→ debounce 800–1200ms
→ Saving
→ gửi content + version
→ save
→ Saved
```

Offline:

```text
IndexedDB queue
→ Offline
→ có mạng
→ sync
→ conflict nếu version cũ
```

## 9. Event và Reminder

```text
Calendar
→ New Event
→ nhập thời gian/recurrence
→ chọn reminder
→ save
→ schedule reminder
```

## 10. AI trò chuyện, phân tích hoặc tạo kế hoạch

```text
Owner mở /app/ai
→ trò chuyện nhiều lượt như chatbot thông thường
→ khi yêu cầu tạo/sửa Goal, Roadmap, Task, Event hoặc Note
→ backend lấy context được phép
→ provider
→ validate structured output
→ hiển thị proposal có thể sửa và danh sách thay đổi
→ owner xác nhận proposal hiện tại
→ server re-validate + ownership check
→ Feature Service + transaction/idempotency lưu
→ audit log
→ trả link tới dữ liệu vừa tạo
```

AI không tự sửa dữ liệu quan trọng trước confirm.

## 11. Đăng xuất

```text
Owner menu
→ Logout
→ hủy session
→ xóa cache private phù hợp
→ chuyển /
→ public CV vẫn xem được
```

## 12. Authorization tests

Account thường chỉ dùng trong development/test để xác minh:

- không vào `/admin`;
- không đọc dữ liệu owner khác;
- không mở khóa thêm thông tin public.

Account test không phải một persona production.
