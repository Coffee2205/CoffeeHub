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
