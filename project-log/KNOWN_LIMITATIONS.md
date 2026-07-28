# Known Limitations

- Admin/CMS covers Projects with private cover/gallery media, Profile/About text, Experience, Skills, Education, Posts, Page Sections, Navigation/Footer/Social links, FAQ, SEO and Site Settings with publishing state. Public home rendering is complete; public detail routes, Admin preview and profile avatar remain in later Task 07 subtasks. Live published-data and authenticated browser E2E need Supabase runtime configuration and a development admin account.

- Database và authentication foundation đã có; CMS và feature application vẫn thuộc các task sau.
- Route `/` là public CoffeeHub home hoàn chỉnh; `/projects`, `/posts` và public detail/about routes chưa được triển khai.
- Dashboard hiện tính ngày/tuần theo UTC vì Profile chưa có timezone preference.
# Supabase đã khởi tạo database foundation

Supabase CoffeeHub development project đã có domain schema, migrations, RLS và Auth flow nhưng chưa có account thật, Storage bucket hoặc lịch backup/export vận hành. Email confirmation/refresh/logout E2E cần redirect URL và email của môi trường triển khai.
