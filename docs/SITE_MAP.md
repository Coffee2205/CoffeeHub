# Sitemap — CoffeeHub

## Website công khai

```text
/
├── /features
├── /about
├── /privacy
├── /terms
└── /login
```

### `/`

- Hero.
- Vấn đề CoffeeHub giải quyết.
- Tính năng chính.
- Demo Dashboard.
- Goal và Roadmap.
- Cross-device/PWA.
- AI Assistant.
- Tech stack.
- CTA đăng nhập hoặc xem dự án.

### `/features`

- Dashboard.
- Goals.
- Roadmaps.
- Tasks.
- Calendar.
- Notes.
- Notifications.
- AI Assistant.

### `/about`

- Mục tiêu dự án.
- Câu chuyện xây dựng.
- Công nghệ.
- Vai trò người phát triển.
- Liên kết repository hoặc portfolio nếu được phép.

### `/privacy`

- Dữ liệu được lưu.
- Dữ liệu gửi đến AI.
- Quyền kiểm soát AI.
- Cookies/session.

### `/terms`

- Điều khoản sử dụng demo.
- Giới hạn trách nhiệm.

### `/login`

- Form đăng nhập.
- Thông báo lỗi.
- Chuyển hướng về workspace sau khi đăng nhập.

## Ứng dụng cá nhân

```text
/app
├── /app/dashboard
├── /app/profile
├── /app/goals
│   ├── /app/goals/new
│   └── /app/goals/[goalId]
├── /app/roadmaps
│   └── /app/roadmaps/[roadmapId]
├── /app/tasks
│   └── /app/tasks/[taskId]
├── /app/calendar
├── /app/notes
│   ├── /app/notes/new
│   └── /app/notes/[noteId]
├── /app/checklists
├── /app/notifications
├── /app/ai
└── /app/settings
    ├── /app/settings/general
    ├── /app/settings/notifications
    ├── /app/settings/ai
    └── /app/settings/data
```

## Route protection

- Mọi route dưới `/app` yêu cầu session hợp lệ.
- Server phải kiểm tra quyền truy cập dữ liệu theo `userId`.
- Không chỉ ẩn navigation ở client.
- ID hợp lệ nhưng không thuộc user hiện tại phải trả về not found hoặc forbidden theo quy tắc đã chốt.

## Navigation desktop

```text
Overview
- Dashboard

Workspace
- Goals
- Tasks
- Calendar
- Notes
- Roadmaps

Intelligence
- AI Assistant

Account
- Profile
- Settings
```

## Navigation mobile

Bottom navigation ưu tiên:

```text
Home
Goals
Tasks
Planner
More
```

`More` mở các mục Notes, Roadmaps, AI Assistant, Profile và Settings.
