# Known Limitations

- Public CV content is live from the development database. Avatar and social links remain intentionally empty until the owner supplies and publishes them through Admin; private auth email, phone, date of birth and gender are not public fallbacks.

- Admin/CMS covers Projects with private cover/gallery media, Profile/About text, Experience, Skills, Education, Posts, Page Sections, Navigation/Footer/Social links, FAQ, SEO and Site Settings with publishing state. Profile avatar editing, preview and public rendering are deferred to later Task 07 subtasks; authenticated browser E2E needs a development admin account.

- Database và authentication foundation đã có; CMS và feature application vẫn thuộc các task sau.
- Route `/` hiện là trang preview design foundation, chưa phải landing page hoặc application shell hoàn chỉnh.
- Dashboard hiện tính ngày/tuần theo UTC vì Profile chưa có timezone preference.

# Supabase đã khởi tạo database foundation

Supabase CoffeeHub development project đã có domain schema, migrations, RLS và Auth flow nhưng chưa có account thật, Storage bucket hoặc lịch backup/export vận hành. Email confirmation/refresh/logout E2E cần redirect URL và email của môi trường triển khai.
