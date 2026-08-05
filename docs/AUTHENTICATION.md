# Authentication và access model

## Mô hình sử dụng

CoffeeHub là website CV/portfolio công khai kết hợp với một workspace cá nhân dành cho chủ sở hữu.

Có hai trạng thái sử dụng chính:

```text
Anonymous visitor
→ xem CV/portfolio công khai
→ không cần account
→ không đăng nhập bằng account khách

Owner
→ đăng nhập bằng tài khoản chủ sở hữu
→ tự động vào /app/dashboard
→ truy cập toàn bộ workspace và khu vực quản trị nội dung
```

Giai đoạn hiện tại không cung cấp public registration cho khách truy cập. Không tạo guest account để mở khóa thêm thông tin CV.

## Route groups

### Public CV routes

Không yêu cầu đăng nhập:

```text
/
/about
/projects
/projects/[slug]
/experience
/skills
/education
/posts
/posts/[slug]
/contact
/privacy
/terms
/login
```

Các route này chỉ đọc nội dung đã `published` và không bị xóa mềm.

### Owner workspace routes

Yêu cầu session chủ sở hữu hợp lệ:

```text
/app/*
```

Sau khi đăng nhập, owner được sử dụng toàn bộ chức năng workspace:

- Dashboard.
- Profile riêng tư.
- Goals.
- Roadmaps.
- Tasks.
- Calendar.
- Notes.
- Checklists.
- Notifications.
- AI Assistant.
- Settings.

### Owner content-management routes

Yêu cầu session owner và quyền `admin`/`owner` đáng tin cậy:

```text
/admin/*
```

Các route này quản lý nội dung CV công khai, media, SEO và site settings.

## Luồng đăng nhập

```text
/login
→ Supabase Auth email/password
→ HttpOnly cookie session qua @supabase/ssr
→ server xác minh claims
→ chuyển đến next hợp lệ hoặc /app/dashboard
```

Quy tắc redirect:

- Anonymous mở `/` → hiển thị CV công khai.
- Anonymous mở `/app/*` → `/login?next=<safe-app-path>`.
- Anonymous mở `/admin/*` → `/login?next=<safe-admin-path>`.
- Owner đăng nhập thành công → `next` hợp lệ hoặc `/app/dashboard`.
- Owner mở `/login` → `/app/dashboard`.
- Owner mở `/` → vẫn xem trang CV công khai giống khách; dùng nút `Dashboard`/`Manage CV` để vào workspace. Không tự redirect khỏi CV.
- Logout → `/`.

Không tạo redirect loop giữa `/`, `/login`, `/app/dashboard` và `/admin`.

## Supabase implementation

```text
email/password
→ Supabase Auth
→ HttpOnly cookie session managed by @supabase/ssr
→ src/proxy.ts refreshes/forwards cookies
→ Server Component/Action verifies getClaims()
→ ownership hoặc app_metadata.role authorization
```

Proxy chỉ refresh session và redirect sớm. `/app` gọi lại `requireUser()` hoặc `requireOwner()` trong server layout; `/admin` gọi `requireAdmin()`/`requireOwnerAdmin()`. Mutation vẫn phải gọi guard phù hợp, không tin `userId` hoặc role từ client.

Role tin cậy lấy từ `app_metadata.role`. `user_metadata` không dùng để phân quyền.

## Danh tính hiển thị và email đăng nhập

- Email trong `auth.users` chỉ dùng cho đăng nhập, khôi phục tài khoản và thông báo bảo mật.
- Tên trên CV, header, dashboard và lời chào lấy từ `profiles.display_name` hoặc field hồ sơ tương đương trong database.
- Owner chỉnh tên này qua `/admin/profile` hoặc giao diện Profile được phân quyền; không cần sửa code hay SQL.
- Không dùng auth email, phần trước dấu `@`, username suy ra từ Gmail hoặc placeholder chứa email làm tên hiển thị.
- Nếu chưa có `display_name`, UI hiển thị lời nhắc cấu hình hồ sơ hoặc fallback trung tính như `CoffeeHub Owner`, tuyệt đối không public auth email.

## Tài khoản

### Production

- Chỉ cần một tài khoản owner/admin do chủ sở hữu quản lý.
- Không public trang đăng ký.
- Không tạo tài khoản khách.
- Khách xem toàn bộ thông tin CV đã publish mà không đăng nhập.

### Development/test

Có thể dùng account thường tạm thời để test authorization denial, nhưng account này không phải một phần UX production và không mở khóa thông tin portfolio.

## Auth-to-profile mapping

`private.handle_new_auth_user()` đồng bộ Auth user sang `public.users` và `public.profiles`.

Function phải:

- là `SECURITY DEFINER`;
- nằm ngoài exposed schema;
- có `search_path` an toàn;
- revoke khỏi `PUBLIC`, `anon`, `authenticated`;
- tạo mapping idempotently.

Nếu production chỉ có một owner, việc tạo thêm user mới phải bị hạn chế bởi cấu hình hoặc quy trình quản trị.

## Trạng thái lỗi và session

- Credential sai trả lỗi chung.
- Session thiếu/hết hạn ở protected route → `/login`.
- Logout chờ `signOut()` và xóa private cache phù hợp.
- Owner không có role quản trị nhưng mở `/admin/*` → `/unauthorized` hoặc `/app/dashboard`.
- Không hiển thị raw auth/database error.

## Acceptance criteria

- Anonymous xem được CV, dự án, kinh nghiệm, kỹ năng và học vấn đã publish.
- Anonymous không cần và không được yêu cầu account khách.
- Anonymous không truy cập được `/app/*` hoặc `/admin/*`.
- Owner đăng nhập và được chuyển vào `/app/dashboard`.
- Owner truy cập toàn bộ app routes.
- Owner/admin quản lý được nội dung public qua `/admin`.
- `/login` không hiển thị registration CTA trong production.
- Refresh protected route giữ session hợp lệ.
- Logout về `/`.
- Không có redirect loop.
- Server Action/API kiểm tra auth/authz độc lập với middleware.
