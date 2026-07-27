# Yêu cầu nội dung — CoffeeHub

## Nguyên tắc chung

- Nội dung ngắn gọn, rõ ràng và tập trung vào hành động.
- Không dùng dữ liệu cá nhân thật trong landing page, seed public hoặc screenshot công khai.
- Không tạo thành tích, số liệu sử dụng hoặc testimonial giả.
- Không khẳng định tính năng đã hoạt động nếu mới là mockup.
- Thuật ngữ phải thống nhất giữa UI, database và tài liệu.

## Ngôn ngữ giao diện

Giai đoạn đầu có thể dùng tiếng Anh hoặc song ngữ tùy trạng thái code hiện tại, nhưng trong cùng một màn hình phải nhất quán.

Các thuật ngữ chuẩn:

```text
Goal
Roadmap
Roadmap Stage
Task
Subtask
Checklist
Event
Reminder
Note
AI Proposal
AI Action
```

Không dùng đồng thời nhiều tên cho cùng một khái niệm nếu chưa có lý do.

## Landing page

Cần chuẩn bị:

- Headline.
- Subheadline.
- Mô tả ngắn sản phẩm.
- Danh sách tính năng.
- Nội dung section PWA.
- Nội dung section AI.
- Tech stack.
- CTA.
- Privacy note.

Headline đề xuất:

> Build your goals. Organize your work. Understand your progress.

Subheadline đề xuất:

> CoffeeHub is a personal productivity workspace for goals, tasks, plans, notes and intelligent assistance across your devices.

## Dashboard

Nội dung động cần có fallback:

- `Good morning/afternoon/evening` theo thời gian.
- `No tasks scheduled for today.`
- `You have no active goals yet.`
- `No upcoming events.`
- `Your changes are saved.`
- `You are offline. Changes will sync later.`

## Goal

Field gợi ý:

- Title.
- Description.
- Why this matters.
- Success criteria.
- Start date.
- Target date.
- Priority.
- Status.

## AI

AI response phải phân biệt rõ:

- Phân tích.
- Đề xuất.
- Dữ liệu sẽ được lưu.
- Dữ liệu chưa được lưu.

Các CTA chuẩn:

```text
Analyze with AI
Generate roadmap
Create task draft
Review proposal
Save to CoffeeHub
Discard
Undo
```

Không dùng từ ngữ khiến người dùng hiểu rằng AI đã lưu khi mới chỉ tạo proposal.

## Nội dung còn cần người dùng cung cấp

- Tên hiển thị chính thức của người sở hữu dự án.
- Domain cuối cùng.
- Repository public/private.
- Ảnh hoặc mockup được phép dùng trên landing page.
- Nội dung portfolio.
- Chính sách privacy thực tế sau khi chọn auth và AI provider.


## Quản trị nội dung

Các nội dung sau phải chỉnh sửa được từ giao diện Admin/CMS:

- hồ sơ cá nhân;
- dự án, ảnh, liên kết, vai trò, công nghệ và trạng thái dự án;
- kinh nghiệm;
- kỹ năng;
- học vấn;
- bài viết;
- banner và section công khai;
- menu, footer và social links;
- FAQ;
- SEO title, description, image và canonical metadata;
- thứ tự hiển thị;
- trạng thái draft/published/hidden.

Admin/CMS phải hỗ trợ theo nhu cầu từng entity:

- tạo, xem, sửa, xóa mềm hoặc ẩn;
- publish/unpublish;
- upload/chọn media;
- xem trước;
- sắp xếp thứ tự;
- validation;
- xác nhận trước hành động phá hủy.

Các route, permission name, enum kỹ thuật và hằng số hệ thống có thể nằm trong code. Nội dung biên tập không được hard-code.
# Quyền biên tập qua Admin/CMS

Mọi nội dung thay đổi sau bàn giao phải sửa được trong giao diện Admin/CMS, không yêu cầu sửa code, Prisma Studio, SQL editor hoặc Supabase dashboard. Phạm vi tối thiểu gồm:

- hồ sơ, giới thiệu, avatar, kinh nghiệm, kỹ năng và học vấn;
- dự án với tiêu đề, slug, tóm tắt, mô tả, vai trò, tech stack, GitHub URL, live URL, trạng thái, ngày, ảnh bìa và gallery;
- bài viết, banner, section, menu, footer, social links, FAQ, SEO và site settings;
- draft/published/hidden, thứ tự hiển thị, preview, publish/unpublish và soft delete.

Media phải có alt text, fallback, MIME/kích thước và metadata tham chiếu. Binary nằm trong Supabase Storage; PostgreSQL chỉ lưu bucket/path/URL/metadata.
