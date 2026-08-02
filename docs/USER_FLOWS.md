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
→ mở /admin/preview hoặc cửa sổ anonymous
→ xác minh nội dung public
```

Nếu owner mở `/` khi session đang hoạt động và hệ thống redirect về app, dùng `/admin/preview` hoặc cửa sổ private để xem đúng trải nghiệm khách.

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

## 10. AI phân tích hoặc tạo kế hoạch

```text
Owner yêu cầu AI
→ backend lấy context được phép
→ provider
→ validate structured output
→ preview proposal
→ owner confirm
→ transaction lưu
→ audit log
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
