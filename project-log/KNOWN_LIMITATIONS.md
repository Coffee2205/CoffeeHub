# Known Limitations

- Admin/CMS and public Home/About/Projects/Posts rendering are complete. Admin draft preview and profile avatar remain in later Task 07 subtasks. Live published-data and authenticated browser E2E need Supabase runtime configuration and a development admin account.

- Database và authentication foundation đã có; CMS và feature application vẫn thuộc các task sau.
- Public Home, About, Projects list/detail and Posts list/detail routes are implemented; live CMS-record verification remains pending environment configuration.
- Dashboard hiện tính ngày/tuần theo UTC vì Profile chưa có timezone preference.
# Supabase đã khởi tạo database foundation

Supabase CoffeeHub development project đã có domain schema, migrations, RLS và Auth flow nhưng chưa có account thật, Storage bucket hoặc lịch backup/export vận hành. Email confirmation/refresh/logout E2E cần redirect URL và email của môi trường triển khai.
