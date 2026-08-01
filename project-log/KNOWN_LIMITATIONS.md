# Known Limitations

- Admin/CMS, public Home/About/Projects/Posts rendering, Admin draft preview and profile avatar media are complete with live anonymous/user/Admin browser E2E.

- Database và authentication foundation đã có; CMS và feature application vẫn thuộc các task sau.
- Public Home, About, Projects list/detail and Posts list/detail routes are implemented and verified against live development CMS records.
- Dashboard hiện vẫn tính ngày/tuần theo UTC dù Profile đã lưu timezone preference; việc tiêu thụ preference chưa thuộc Task 08.
# Supabase đã khởi tạo database foundation

Supabase CoffeeHub development project đã có domain schema, migrations, RLS, Auth flow và các Storage bucket phục vụ Project/Profile media nhưng chưa có lịch backup/export vận hành. Email confirmation/refresh/logout E2E cần redirect URL và email của môi trường triển khai.
