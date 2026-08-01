# Task 07 — Admin and Content Management

## Trạng thái

Completed

## Subtask progress

- [x] 07A — Admin foundation and Projects CRUD (media excluded).
- [x] 07B — Media assets and Supabase Storage.
- [x] 07C1 — Profile/About text content and publishing controls.
- [x] 07C2 — Experience, Skills and Education CRUD.
- [x] 07C3a — Posts and Page/Section CMS.
- [x] 07C3b — Navigation, Footer, Social, FAQ, SEO and Site Settings CMS.
- [x] 07D1 — Public home rendering from published CMS data.
- [x] 07D2 — Public Profile, Projects and Posts routes plus navigation/footer/FAQ/SEO.
- [x] 07D3 — Admin preview and final anonymous/user/admin browser verification.
- [x] 07E — Profile avatar media management and public avatar rendering.

07E result (2026-08-01): added protected avatar upload, replacement and confirmed deletion on `/admin/profile`, using a private `profile-avatars` bucket with 5 MB JPEG/PNG/WebP restrictions, controlled owner paths, metadata constraints, public-published/owner/Admin RLS and signed delivery. Published avatars render with alt text and safe fallbacks on `/` and `/about`. Live Admin upload → anonymous desktop/mobile rendering → Admin deletion passed with cleanup; 32 tests, Prisma validation/generation, lint, typecheck and production build pass. Task 07 is complete.

07A result (2026-07-27): added Prisma schema and additive migrations, optimized RLS, runtime validation, repository, Server Actions, protected Admin UI, list/create/edit, ordering, status and confirmed soft delete. Prisma validate/generate, 8 tests, lint, typecheck, build and Supabase advisors passed. Task remains In Progress because media, preview, remaining entities and public rendering are pending.

07B result (2026-07-27): added private `project-media` bucket, 5 MB/MIME restrictions, Storage and metadata RLS, `MediaAsset`/`ProjectMedia`, cover/gallery upload, alt text, controlled paths and confirmed cleanup from Admin. Security Advisor is clean; 14 tests, Prisma checks, lint, typecheck and build pass. Authenticated live upload remains an environment E2E check because the development project has no real test account.

07C1 result (2026-07-27): added protected Profile/About editing for display name, headline, bio and draft/published/hidden status. The additive migration and RLS expose only published, non-deleted profiles to anonymous clients; Prisma checks, 16 tests, lint, typecheck, build and Supabase Security Advisor pass. Public rendering/browser E2E is prioritized next; avatar editing follows after the public site is usable.

07C2 result (2026-07-27): added separate Experience, Skill and Education models with protected Admin create/list/edit/soft-delete flows, ordering, runtime validation and draft/published/hidden controls. The additive Supabase migration uses explicit Data API grants and public-published/owner/admin RLS; role checks passed in a rollback transaction, Security Advisor is clean, and Prisma checks, 20 tests, lint, typecheck and build pass. Authenticated browser E2E still requires a development admin account.

07C3a result (2026-07-27): added Post and ContentSection models plus protected Admin create/list/edit/soft-delete flows, ordering, runtime validation, CTA pair validation and publishing controls. The additive migration has explicit Data API grants and public-published/owner/admin RLS; rollback role checks passed for both tables, Security Advisor is clean, and Prisma checks, 24 tests, lint, typecheck and build pass. Public rendering remains 07D and authenticated browser E2E still requires a development admin account.

07C3b result (2026-07-27): added SiteLink, Faq and singleton SiteSetting models with protected Admin create/list/edit/soft-delete or upsert flows for navigation/footer/social links, FAQs, identity, privacy and SEO metadata. Runtime URL/length validation, ordering and publishing controls are covered by tests. The additive Supabase migration uses explicit grants and public-published/owner/admin RLS; rollback role checks passed, Security Advisor is clean, and Prisma checks, 31 tests, lint, typecheck and build pass. Public rendering is now the immediate 07D priority; profile avatar moved to 07E after the website is visible.

07D1 result (2026-07-28): replaced the design-system preview at `/` with a complete responsive public home. The dynamic Server Component reads only published, non-deleted Site Settings, home sections, profile, projects, FAQ and links through a dedicated public repository, generates CMS metadata, and renders useful empty/error states. Desktop 1440×1000 and mobile 390×844 browser checks passed without overflow or Next.js overlays. Live published records could not be exercised because this workspace has no `.env.local` or Supabase runtime variables; the anonymous fallback path was verified instead. Task 07 remains In Progress for 07D2 routes, 07D3 preview/E2E and 07E avatar.

07D2 result (2026-07-28): added public `/about`, `/projects`, `/projects/[slug]`, `/posts` and `/posts/[slug]` routes with shared CMS navigation/footer, responsive layouts, route metadata, published-only queries, 404 handling and useful empty/error states. All five routes returned HTTP 200 with the missing-environment fallbacks; browser checks passed at 1440×1000 and 390×844 without overflow or error overlays. Live published records remain an environment E2E check for 07D3 because no Supabase runtime variables or development account are present. Task 07 remains In Progress for 07D3 and 07E.

07D3 result (2026-07-29): added protected `/admin/preview` with explicit Admin verification, status-labelled Draft/Published/Hidden previews, useful empty/error states and links back to each CMS editor. A development Admin published a labelled Profile through `/admin/profile`; anonymous `/` and `/about` displayed it immediately while anonymous preview access redirected to login and a regular authenticated user redirected to `/unauthorized`. Browser E2E passed for anonymous, user and Admin at 1440×1000 and 390×844 without horizontal overflow or Next.js overlays. Development account setup is documented without secrets in `docs/DEVELOPMENT_ACCOUNTS.md`; 31 tests, lint, typecheck and production build pass. Task 07 remains In Progress only for 07E avatar.

## Thành quả bắt buộc nhìn thấy

Task 07 không được hoàn thành chỉ với schema, migration và Admin CRUD. Người dùng phải nhìn thấy website thật được dựng từ dữ liệu CMS.

### Route bắt buộc

- `/` — public home đọc Site Settings, published sections, profile summary, featured projects, FAQ và navigation/footer từ database.
- `/projects` và `/projects/[slug]` — danh sách và chi tiết dự án đã publish.
- `/posts` và `/posts/[slug]` — danh sách và chi tiết bài viết đã publish.
- `/about` hoặc section tương đương — profile, experience, skills và education đã publish.
- `/admin/*` — giao diện quản trị tương ứng.
- Preview route an toàn cho draft, chỉ Admin truy cập.

### Luồng sử dụng bắt buộc

1. Admin đăng nhập và tạo/chỉnh một Project hoặc Site Section.
2. Admin publish nội dung.
3. Mở public route bằng cửa sổ anonymous.
4. Nội dung mới xuất hiện mà không sửa code hoặc deploy lại.

### Cổng hoàn thành

- Public site có bố cục hoàn chỉnh, không còn là design-component preview.
- Có fallback/empty state đẹp khi database chưa có nội dung.
- Có hướng dẫn tạo development admin account hoặc cấu hình account kiểm thử; không ghi secret vào tài liệu.
- Browser E2E được chạy cho anonymous public, authenticated user và admin ở desktop/mobile.
- Báo cáo ghi URL, cách sử dụng và các route đã chụp/kiểm tra.

## Mục tiêu

Xây dựng giao diện Admin/CMS để người dùng tự cập nhật thông tin và bổ sung dự án mà không sửa code hoặc thao tác database trực tiếp.

## Dependency

- `04-DATABASE-FOUNDATION.md` phải hoàn thành.
- `05-AUTHENTICATION.md` phải hoàn thành.
- `02-DESIGN-FOUNDATION.md` phải hoàn thành.

## Tài liệu cần đọc

- `docs/CONTENT_REQUIREMENTS.md`
- `docs/SITE_MAP.md`
- `docs/ARCHITECTURE_RULES.md`
- `docs/TECHNICAL_DESIGN.md`
- `docs/DESIGN_RULES.md`

## Công việc

- [x] CRUD từ Admin UI cho profile/about/avatar; project (title, slug, summary, description, role, tech stack, GitHub/live URL, status, dates, cover/gallery); experience, skills, education; posts; banner/sections/menu/footer/social/FAQ/SEO/site settings.
- [x] Có draft/published/hidden, ordering, preview, publish/unpublish, soft delete và xác nhận xóa.
- [x] Mỗi entity có Prisma schema/migration, runtime validation, service, repository, Auth/AuthZ, UI states và test access.
- [x] Upload qua Supabase Storage với MIME/size/name/path/overwrite validation, alt, fallback và orphan cleanup; database chỉ lưu bucket/path/URL/metadata.
- [x] Private object chỉ qua server hoặc signed URL; service role key không xuống client.
- [x] RLS phân biệt public-published, admin draft, owner-private và admin.

### Nền tảng Admin

- [x] Tạo layout và navigation `/admin`.
- [x] Bảo vệ toàn bộ admin routes bằng authentication và authorization.
- [x] Tạo dashboard quản trị với shortcut và trạng thái nội dung.
- [x] Có loading, empty, error và permission-denied state.

### Content model

- [x] Profile.
- [x] Projects.
- [x] Experiences.
- [x] Skills.
- [x] Education.
- [x] Posts.
- [x] Pages/sections.
- [x] Navigation và footer links.
- [x] FAQ.
- [x] Site settings.
- [x] SEO metadata.
- [x] Media assets hoặc media references.

### CRUD và biên tập

- [x] Tạo mới, xem, sửa và xóa mềm/ẩn khi phù hợp.
- [x] Draft, published, hidden.
- [x] Sắp xếp `displayOrder`.
- [x] Upload hoặc chọn ảnh.
- [x] Preview trước khi publish khi phù hợp.
- [x] Inline validation và thông báo lưu thành công/thất bại.
- [x] Xác nhận trước hành động phá hủy.

### Kết nối hiển thị

- [x] Website công khai đọc nội dung từ database và có route hoàn chỉnh để người dùng xem ngay.
- [x] App đọc site settings cần thiết từ database.
- [x] Có fallback an toàn khi chưa có nội dung.
- [x] Không giữ bản sao hard-code có thể gây lệch dữ liệu.

## Không thực hiện

- Không xây page builder kéo-thả tổng quát.
- Không cho phép sửa route, permission hoặc enum kỹ thuật từ CMS.
- Không public nội dung draft.
- Không chạy production migration.
- Không cho người không có quyền truy cập `/admin`.

## File dự kiến

- `src/app/admin/...`
- `src/features/admin/...`
- `src/features/content/...`
- `src/server/services/content/...`
- `src/server/repositories/content/...`
- `prisma/schema.prisma`
- `prisma/migrations/...`

Đường dẫn có thể thay đổi theo repository audit nhưng phải tuân thủ architecture rules.

## Ảnh hưởng database

Có. Ưu tiên schema rõ ràng cho từng entity thay vì một bảng JSON chung cho toàn bộ nội dung.

Các entity phải có trường ownership hoặc quyền quản trị phù hợp, timestamps và trạng thái publish. Migration phải additive và có rollback plan.

## Rủi ro

- Public nhầm nội dung draft.
- Upload file không an toàn.
- Admin route thiếu authorization.
- Dữ liệu hard-code và database hiển thị không đồng nhất.
- Xóa nội dung làm mất liên kết hoặc media.

## Tiêu chí hoàn thành

- Người quản trị có thể bổ sung dự án và cập nhật toàn bộ nội dung/media từ UI, gồm publish và ordering, không sửa code hoặc database thủ công.

- Người dùng có thể đăng nhập và tự thêm/sửa/ẩn một dự án.
- Người dùng có thể cập nhật profile, kỹ năng, kinh nghiệm và học vấn.
- Người dùng có thể cập nhật nội dung công khai, menu/footer và SEO metadata.
- Thay đổi đã publish xuất hiện trên website/app mà không sửa code.
- Draft không xuất hiện công khai.
- Validation và authorization được kiểm tra.
- Không cần mở Prisma Studio, SQL editor hoặc Supabase dashboard cho hoạt động biên tập thông thường.
- Lint, typecheck, test/build liên quan đạt khi môi trường cho phép.
- Task và project-log được cập nhật.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/posts/page.tsx`
- `src/app/posts/[slug]/page.tsx`
- `src/app/not-found.tsx`
- `src/features/public-site/public-site.repository.ts`
- `src/features/public-site/public-shell.tsx`
- `src/features/public-site/admin-preview.repository.ts`
- `src/app/admin/preview/page.tsx`
- `docs/DEVELOPMENT_ACCOUNTS.md`

### Quyết định kỹ thuật

- Public home dùng dynamic Server Component và một public read repository lọc rõ `PUBLISHED` cùng `deletedAt: null`.
- Khi database chưa cấu hình, không có dữ liệu hoặc tạm lỗi, public shell vẫn hoạt động và giải thích cách nội dung xuất hiện.
- Dynamic detail routes dùng async `params`, CMS metadata và chỉ trả record đã publish; slug không tồn tại render 404.

### Vấn đề còn lại

- Profile avatar vẫn thuộc 07E; không thực hiện trong 07D3.

### Kiểm tra

- Lint: Đạt (`npm run lint`).
- Typecheck: Đạt (`npm run typecheck`).
- Test: Đạt (31/31, `npm test`).
- Build: Đạt (`npm run build`); `/` là dynamic route.
- Visible result URL: `http://127.0.0.1:3130/admin/preview`, `/`, `/about` và `/app/dashboard` trong phiên kiểm tra.
- How to use: Admin đăng nhập, chỉnh nội dung trong `/admin/profile` hoặc các CMS route, mở `/admin/preview`, chọn `PUBLISHED`, rồi tải lại `/` bằng cửa sổ anonymous.
- Browser anonymous desktop/mobile: Đạt ở 1440×1000 và 390×844; published Profile xuất hiện trên `/` và `/about`, anonymous preview redirect về login.
- Browser authenticated user: Đạt ở desktop/mobile; `/app/dashboard` hoạt động và `/admin/preview` redirect tới `/unauthorized`.
- Browser authenticated Admin: Đạt ở desktop/mobile; preview hiển thị Draft/Published, không overlay, không overflow.
- Manual/E2E publish: Đạt; Profile development được lưu qua Admin UI và xuất hiện public mà không sửa code hoặc deploy.
- Commit/push: hoàn tất trong bước Git delivery cuối phiên 07D3; xem lịch sử repository.
