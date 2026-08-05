# Sitemap — CoffeeHub

## Nguyên tắc điều hướng

```text
Khách truy cập
→ CV/portfolio công khai
→ không cần account

Chủ sở hữu đã đăng nhập
→ /app/dashboard
→ toàn bộ workspace cá nhân
→ /admin để chỉnh nội dung CV
```

Không có guest-account flow.

## Website CV/portfolio công khai

```text
/
├── /about
├── /projects
│   └── /projects/[slug]
├── /experience
├── /skills
├── /education
├── /posts
│   └── /posts/[slug]
├── /contact
├── /privacy
├── /terms
└── /login
```

### `/`

Trang CV tổng hợp:

- Hero: tên, headline, giới thiệu ngắn, avatar.
- CTA liên hệ, tải/xem CV, GitHub, LinkedIn và website.
- Kinh nghiệm nổi bật.
- Kỹ năng.
- Học vấn.
- Dự án nổi bật.
- Bài viết gần đây nếu có.
- Footer và social links.

Chỉ hiển thị dữ liệu đã publish.
Tên trong Hero lấy từ hồ sơ database (`display_name`), không lấy từ auth email/Gmail. Owner đang đăng nhập vẫn xem route này như CV và có thêm CTA tới Dashboard/Manage CV.

### `/about`

- Giới thiệu đầy đủ.
- Định hướng nghề nghiệp.
- Kinh nghiệm.
- Học vấn.
- Kỹ năng.
- CV/resume link nếu đã publish.

### `/projects` và `/projects/[slug]`

- Danh sách dự án đã publish.
- Case study, vai trò, công nghệ, trách nhiệm, GitHub và live URL.
- Không yêu cầu đăng nhập để xem chi tiết.

### `/experience`, `/skills`, `/education`

Có thể là route độc lập hoặc section trên `/about`; sitemap cuối cùng phải nhất quán với UI thực tế.

### `/posts`

Nội dung công khai đã publish.

### `/login`

Chỉ dành cho chủ sở hữu:

- Email/password.
- Không có guest login.
- Không có public signup trong production.
- Đăng nhập thành công chuyển đến `/app/dashboard`.

## Workspace cá nhân của owner

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

Mọi route dưới `/app` yêu cầu session owner hợp lệ.

## Quản trị CV/CMS

```text
/admin
├── /admin/profile
├── /admin/projects
├── /admin/experiences
├── /admin/skills
├── /admin/education
├── /admin/posts
├── /admin/pages
├── /admin/navigation
├── /admin/media
├── /admin/seo
├── /admin/settings
└── /admin/preview
```

Owner/admin dùng các route này để chỉnh thông tin hiển thị công khai mà không sửa code hoặc database thủ công.

## Access matrix

| Trạng thái | Public CV | `/app/*` | `/admin/*` |
|---|---:|---:|---:|
| Anonymous | Có | Không | Không |
| Owner đã đăng nhập | Có, không tự redirect | Có toàn bộ | Có |
| Account test không phải owner/admin | Có | Chỉ khi policy cho phép test | Không |

Production không cung cấp account khách.

## Navigation

### Public

```text
Home
About
Projects
Experience
Skills
Posts
Contact
Owner Login
```

### Owner workspace

```text
Dashboard
Profile
Goals
Roadmaps
Tasks
Calendar
Notes
AI Assistant
Settings
Manage CV
Logout
```

Mobile dùng bottom navigation cho workspace; public CV dùng header/menu responsive.
