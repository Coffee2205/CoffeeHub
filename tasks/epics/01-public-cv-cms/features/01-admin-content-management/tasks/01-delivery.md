# Task 01 — Admin and Content Management delivery

## Hierarchy

- Epic: `Public CV and Content Management`
- Feature: `Admin and Content Management`
- Source roadmap item: `tasks/epics/01-public-cv-cms/features/01-admin-content-management/FEATURE.md`
- Task path: `tasks/epics/01-public-cv-cms/features/01-admin-content-management/tasks/01-delivery.md`

## Trạng thái

In Progress

## Subtask progress

- [x] 07A — Admin foundation and Projects CRUD (media excluded).
- [x] 07B — Media assets and Supabase Storage.
- [x] 07C1 — Profile/About text content and publishing controls.
- [x] 07C2 — Experience, Skills and Education CRUD.
- [x] 07C3a — Posts and Page/Section CMS.
- [x] 07C3b — Navigation, Footer, Social, FAQ, SEO and Site Settings CMS.
- [x] Access-model alignment — public CV without guest accounts; owner-only login for `/app` and `/admin`.
- [x] 07C4 — Profile avatar media management.
- [ ] 07D — Public rendering, preview and final access verification.

07A result (2026-07-27): added Prisma schema and additive migrations, optimized RLS, runtime validation, repository, Server Actions, protected Admin UI, list/create/edit, ordering, status and confirmed soft delete. Prisma validate/generate, 8 tests, lint, typecheck, build and Supabase advisors passed. Task remains In Progress because media, preview, remaining entities and public rendering are pending.

07B result (2026-07-27): added private `project-media` bucket, 5 MB/MIME restrictions, Storage and metadata RLS, `MediaAsset`/`ProjectMedia`, cover/gallery upload, alt text, controlled paths and confirmed cleanup from Admin. Security Advisor is clean; 14 tests, Prisma checks, lint, typecheck and build pass. Authenticated live upload remains an environment E2E check because the development project has no real test account.

07C1 result (2026-07-27): added protected Profile/About editing for display name, headline, bio and draft/published/hidden status. The additive migration and RLS expose only published, non-deleted profiles to anonymous clients; Prisma checks, 16 tests, lint, typecheck, build and Supabase Security Advisor pass. Avatar editing and authenticated browser E2E remain for later Task 07 work.

07C2 result (2026-07-27): added separate Experience, Skill and Education models with protected Admin create/list/edit/soft-delete flows, ordering, runtime validation and draft/published/hidden controls. The additive Supabase migration uses explicit Data API grants and public-published/owner/admin RLS; role checks passed in a rollback transaction, Security Advisor is clean, and Prisma checks, 20 tests, lint, typecheck and build pass. Authenticated browser E2E still requires a development admin account.

07C3a result (2026-07-27): added Post and ContentSection models plus protected Admin create/list/edit/soft-delete flows, ordering, runtime validation, CTA pair validation and publishing controls. The additive migration has explicit Data API grants and public-published/owner/admin RLS; rollback role checks passed for both tables, Security Advisor is clean, and Prisma checks, 24 tests, lint, typecheck and build pass. Public rendering remains 07D and authenticated browser E2E still requires a development admin account.

07C3b result (2026-07-27): added SiteLink, Faq and singleton SiteSetting models with protected Admin create/list/edit/soft-delete or upsert flows for navigation/footer/social links, FAQs, identity, privacy and SEO metadata. Runtime URL/length validation, ordering and publishing controls are covered by tests. The additive Supabase migration uses explicit grants and public-published/owner/admin RLS; rollback role checks passed, Security Advisor is clean, and Prisma checks, 31 tests, lint, typecheck and build pass. Profile avatar remains 07C4; public rendering/preview remains 07D.

Access-model alignment result (2026-08-02): removed public signup from the server action and login UI, restricted post-login redirects to exact `/app` and `/admin` route trees, redirected successful logout to the public CV, and disabled new-user signup in Supabase Auth. Anonymous public rendering and protected-route redirects passed desktop/mobile browser checks; 41 tests, lint, typecheck and production build pass. Task remains In Progress; 07C4 is next.

07C4 reconciliation result (2026-08-02): verified the existing implementation from commit `2d831cb` rather than duplicating it. Admin Profile supports validated JPEG/PNG/WebP upload, replacement through unique object paths, alt text, confirmation before delete, cleanup/rollback, and rendering on Home/About. The live private `profile-avatars` bucket has a 5 MB limit and SELECT/INSERT/UPDATE/DELETE policies; profile avatar columns are present. 41 tests, lint, typecheck and production build pass. Browser automation timed out in the CLI orchestration layer and is not claimed as a fresh pass; no test profile metadata or Storage object remained. Task stays In Progress for 07D.

## Mục tiêu

Xây dựng giao diện Admin/CMS để người dùng tự cập nhật thông tin và bổ sung dự án mà không sửa code hoặc thao tác database trực tiếp.

## Dependency

- `tasks/epics/00-foundation/features/04-database-foundation/FEATURE.md` phải hoàn thành.
- `tasks/epics/00-foundation/features/05-authentication/FEATURE.md` phải hoàn thành.
- `tasks/epics/00-foundation/features/02-design-foundation/FEATURE.md` phải hoàn thành.

## Tài liệu cần đọc

- `docs/CONTENT_REQUIREMENTS.md`
- `docs/SITE_MAP.md`
- `docs/ARCHITECTURE_RULES.md`
- `docs/TECHNICAL_DESIGN.md`
- `docs/DESIGN_RULES.md`

## Subtasks

- [ ] CRUD từ Admin UI cho profile/about/avatar; project (title, slug, summary, description, role, tech stack, GitHub/live URL, status, dates, cover/gallery); experience, skills, education; posts; banner/sections/menu/footer/social/FAQ/SEO/site settings.
- [ ] Có draft/published/hidden, ordering, preview, publish/unpublish, soft delete và xác nhận xóa.
- [ ] Mỗi entity có Prisma schema/migration, runtime validation, service, repository, Auth/AuthZ, UI states và test access.
- [ ] Upload qua Supabase Storage với MIME/size/name/path/overwrite validation, alt, fallback và orphan cleanup; database chỉ lưu bucket/path/URL/metadata.
- [ ] Private object chỉ qua server hoặc signed URL; service role key không xuống client.
- [ ] RLS phân biệt public-published, admin draft, owner-private và admin.

### Nền tảng Admin

- [ ] Tạo layout và navigation `/admin`.
- [ ] Bảo vệ toàn bộ admin routes bằng authentication và authorization.
- [ ] Tạo dashboard quản trị với shortcut và trạng thái nội dung.
- [ ] Có loading, empty, error và permission-denied state.

### Content model

- [ ] Profile.
- [ ] Projects.
- [ ] Experiences.
- [ ] Skills.
- [ ] Education.
- [ ] Posts.
- [ ] Pages/sections.
- [ ] Navigation và footer links.
- [ ] FAQ.
- [ ] Site settings.
- [ ] SEO metadata.
- [ ] Media assets hoặc media references.

### CRUD và biên tập

- [ ] Tạo mới, xem, sửa và xóa mềm/ẩn khi phù hợp.
- [ ] Draft, published, hidden.
- [ ] Sắp xếp `displayOrder`.
- [ ] Upload hoặc chọn ảnh.
- [ ] Preview trước khi publish khi phù hợp.
- [ ] Inline validation và thông báo lưu thành công/thất bại.
- [ ] Xác nhận trước hành động phá hủy.

### Kết nối hiển thị

- [ ] Website công khai đọc nội dung từ database.
- [ ] App đọc site settings cần thiết từ database.
- [ ] Có fallback an toàn khi chưa có nội dung.
- [ ] Không giữ bản sao hard-code có thể gây lệch dữ liệu.

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

- Auth login action/form/page, safe owner redirect helper and redirect tests.
- ESLint ignores generated `.vercel` output.
- Task and project-log records.

### Quyết định kỹ thuật

- Public visitors do not receive guest accounts; only existing owner/admin accounts may sign in.
- Safe `next` redirects are limited to exact or nested `/app` and `/admin` paths.

### Vấn đề còn lại

- 07D public rendering, preview and final access verification remains.

### Kiểm tra

- Lint: Đạt (`npm run lint`).
- Typecheck: Đạt (`npm run typecheck`).
- Test: Đạt (41/41).
- Build: Đạt (`npm run build`, Prisma generate + Next.js Turbopack).
- Manual test: Access-model browser checks remain passed; fresh 07C4 authenticated browser automation timed out in the CLI layer and is not counted as a pass. Live database cleanup was verified.
- Commit: Chưa tạo.
- Push `origin/dev`: Chưa thực hiện.
