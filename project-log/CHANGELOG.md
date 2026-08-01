# Changelog

## 2026-08-02 — Task 08 Workspace Profile

- Added protected `/app/profile` with editable workspace name/timezone, verified account details, public visibility summary and public/Admin navigation.
- Added owner-scoped server persistence, validation tests and an additive `profiles.workspace_name`/`profiles.timezone` migration applied to development.
- Validation: 34 tests, Prisma validate/generate, lint, typecheck and production build pass; live Admin save returned `?saved=1` with confirmation.
- Known issue: Dashboard continues to calculate date boundaries in UTC until a later task consumes the stored timezone preference.

## 2026-08-01 — Task 07E Profile avatar media

- Added protected avatar upload, replacement and confirmed deletion on `/admin/profile`, backed by a private Supabase Storage bucket and complete profile media metadata.
- Added controlled owner paths, MIME/5 MB validation, public-published/owner/Admin Storage RLS, signed URL delivery, orphan cleanup and safe fallback states.
- Rendered published avatars with alt text on `/` and `/about`; live Admin upload → anonymous render → Admin delete passed at 1440×1000 and 390×844 with no overflow or error overlay.
- Validation: 32 tests, Prisma validate/generate, lint, typecheck and production build pass. Task 07 is complete; Task 08 was not started.

## 2026-07-29 — Task 07D3 Admin preview and live E2E

- Added the protected `/admin/preview` route with Draft/Published/Hidden status labels, editor links and safe empty/error states.
- Verified a real Admin UI publish appears immediately on anonymous `/` and `/about`; public repositories remain published-only.
- Verified anonymous redirects to login, regular user redirects to unauthorized, and Admin preview access at 1440×1000 and 390×844 without overflow or error overlays.
- Added secret-free development account guidance and confirmed 31 tests, lint, typecheck and production build pass.

## 2026-07-28 — Task 07D2 Public content routes

- Added responsive public About, Projects list/detail and Posts list/detail routes with shared navigation/footer and metadata.
- Extended the public repository with published-only Profile, Experience, Skill, Education, Project and Post queries; hidden, draft and soft-deleted content is excluded.
- Added useful empty/unavailable states and a public 404 page; desktop/mobile browser checks and HTTP smoke tests passed without overflow or error overlays.
- Live published-record verification remains for 07D3 because this workspace has no Supabase runtime environment or development account.

## 2026-07-28 — Task 07D1 Public home rendering

- Replaced the `/` design preview with a responsive public CoffeeHub website driven by published CMS data.
- Added published-only queries for Site Settings, home sections, profile, projects, FAQ and navigation/footer/social links, plus CMS metadata and safe empty/error states.
- Verified the anonymous fallback at 1440×1000 and 390×844 with no error overlay or horizontal overflow; live CMS records require the missing local Supabase runtime environment.

## 2026-07-27 — Task 07C3b Site settings CMS

- Summary: Added protected Admin management for navigation/footer/social links, FAQ, identity/privacy content and SEO settings.
- Files: Prisma models/migration, site-settings validation/repository/actions/forms, Admin routes/navigation/dashboard, tests, task and project-log.
- Database impact: Added `site_links`, `faqs` and `site_settings` with constraints, indexes, triggers, explicit grants and RLS to the Supabase development project.
- Validation: Prisma validate/generate, 31 tests, clean lint, typecheck, build, rollback RLS checks for anonymous/owner/non-owner and clean Supabase Security Advisor.
- Commit/push: pending final Git step in this session.
- Known issues: Authenticated Admin browser E2E awaits a real development account; profile avatar is 07C4 and public rendering/preview is 07D. New unused-index notices are expected INFO on empty development tables ([Supabase remediation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)).

---

## 2026-07-27 — Task 07C3a Posts and Page Sections CMS

- Summary: Added Post and ContentSection Admin CRUD with ordering, CTA validation and publishing controls.
- Files: Prisma models/migration, site-content validation/repository/actions/forms, Admin routes/navigation/dashboard, tests, task and project-log.
- Database impact: Added `posts` and `content_sections` with constraints, indexes, triggers, explicit grants and RLS to the Supabase development project.
- Validation: Prisma validate/generate, 24 tests, clean lint, typecheck, build, rollback RLS checks for anonymous/owner/non-owner and clean Supabase Security Advisor.
- Commit/push: pending final Git step in this session.
- Known issues: Authenticated Admin browser E2E awaits a real development account; remaining site settings are 07C3b and public rendering is 07D.

---

## 2026-07-27 — Task 07C2 Resume content CMS

- Summary: Added Experience, Skill and Education Admin CRUD with ordering and publishing controls.
- Files: Prisma models/migration, shared resume validation/repository/actions/forms, Admin routes/navigation, tests, task and project-log.
- Database impact: Added `experiences`, `skills` and `education` with constraints, indexes, triggers, explicit grants and RLS to the Supabase development project.
- Validation: Prisma validate/generate, 20 tests, lint, typecheck, build, rollback RLS checks for anonymous/owner/non-owner and clean Supabase Security Advisor.
- Commit/push: pending final Git step in this session.
- Known issues: Authenticated Admin browser E2E awaits a real development account; public rendering remains 07D.

---

## 2026-07-27 — Task 07C1 Profile/About CMS

- Summary: Added protected Profile/About text editing with draft, published and hidden states.
- Files: Prisma profile model/migration, Profile schema/repository/action, Admin page/navigation, tests, task and project-log.
- Database impact: Added `status`, `published_at`, constraint/index and command-specific RLS policies to `profiles` on the Supabase development project.
- Validation: Prisma validate/generate, 16 tests, lint, typecheck, build, migration/policy inspection and Supabase Security Advisor passed.
- Commit/push: pending final Git step in this session.
- Known issues: Avatar editing and authenticated Admin browser E2E remain; the development project has no real test account.

---

## 2026-07-27 — Task 07B Project media

- Summary: Added private Supabase Storage project media with cover/gallery metadata and protected Admin upload/delete.
- Files: Prisma schema/migrations, Storage helpers, project media actions/components, edit route, tests and project-log.
- Database impact: Added `media_assets`, `project_media`, `ProjectMediaKind`, private `project-media` bucket and RLS/Storage policies on the development project.
- Validation: Prisma validate/generate, 14 tests, lint, typecheck, build, bucket/policy inspection and Supabase Security Advisor passed.
- Commit/push: pending final Git step in this session.
- Known issues: Live upload with an authenticated admin awaits a real development account; no secret/service-role key is required.

---

## 2026-07-27 — Task 00 foundation maintenance

- Summary: Patched Prisma to 7.9.1, removed unused privileged-key configuration and added strict environment validation.
- Files: package manifest/lockfile, env helpers/contract, login action, tests, deployment handoff, Task 00 and project-log.
- Database impact: None; no migration, data mutation or cloud resource change.
- Validation: Prisma validate/generate, 12 tests, lint, typecheck and production build passed. Audit now has 3 high Next.js transitive advisories, down from 7.
- Commit/push: pending final Git step in this session.
- Known issues: Next.js-packaged `postcss`/`sharp` advisories have no safe npm upgrade path yet.

---

## 2026-07-27 — Task 07A Admin Projects

- Summary: Added protected Admin foundation and Projects CRUD without media, including status, ordering and confirmed soft delete.
- Database impact: Added `projects`, `ContentStatus`, indexes, trigger and optimized RLS to the Supabase development project.
- Validation: Prisma validate/generate, 8 tests, lint, typecheck, build and Supabase advisors passed; only expected unused-index INFO remains.
- Commit/push: pending final Git step in this session.
- Known issues: Media, preview, remaining content entities and public rendering remain in Task 07.

---

## 2026-07-27 — Task 06 Dashboard

- Summary: Thêm Dashboard server-rendered với Task hôm nay/quá hạn, Goal active, Event 7 ngày, weekly progress và welcome summary theo dữ liệu thật.
- Files: dashboard page/loading, feature repository/service/components/helpers, lazy Prisma getter, tests, Dashboard doc, Task 06 và project-log.
- Database impact: Không đổi schema; chỉ đọc qua Prisma với verified userId. Integration data trong transaction đã rollback.
- Validation: 6 unit tests, lint, typecheck, build, Supabase query transaction và React best-practices review đạt.
- Commit/push: cập nhật bằng kết quả Git của phiên này.
- Known issues: Time boundary đang dùng UTC tới khi Profile có timezone preference; chưa browser-test authenticated UI vì không tạo account thật.

---

## 2026-07-27 — Task 05 Authentication

- Summary: Thêm Supabase email/password Auth, SSR cookie refresh, server guards, login/signup/logout, confirmation callback, admin authorization và Auth-to-Profile mapping.
- Files: auth routes/actions/UI, Supabase helpers/proxy, protected shell/admin state, mapping migration, tests, auth doc, env contract và project-log.
- Database impact: Thêm private trigger function và trigger additive trên `auth.users`; mapping test đã rollback, không còn test data.
- Validation: 3 unit tests, Prisma validate/generate, lint, typecheck, build, HTTP anonymous route smoke-test và Supabase Security Advisor đạt.
- Commit/push: cập nhật bằng kết quả Git của phiên này.
- Known issues: E2E email confirmation/refresh/logout với account thật cần cấu hình redirect URL và email của môi trường triển khai; không tạo external credential trong task.

---

## 2026-07-27 — Task 04 Database Foundation

- Summary: Tạo schema domain Prisma/Supabase, migration additive, composite ownership constraints, RLS owner/admin và seed development idempotent.
- Files: Prisma schema/config/seed/migrations, database doc, env contract, package manifest/lockfile, Task 04 và project-log.
- Database impact: Tạo 8 bảng public rỗng cùng enum, index, trigger và policy RLS trên Supabase CoffeeHub development project; không có destructive DDL hoặc dữ liệu production.
- Validation: Prisma validate/generate, lint, typecheck, build, Supabase advisors và RLS role tests đạt; dữ liệu kiểm thử đã rollback.
- Commit/push: cập nhật bằng kết quả Git của phiên này.
- Known issues: Chưa có Auth user/flow; unused-index INFO là dự kiến khi database chưa có traffic.

---

## 2026-07-27 — Task 03 App Shell

- Summary: Thêm responsive private workspace shell, navigation active state và route-level loading/error/not-found states.
- Files: `src/app/app`, `src/components/layout`, `src/components/navigation`, Task 03 và project-log.
- Database impact: Không có; không query Prisma/Supabase và không tạo migration.
- Validation: lint, typecheck, build, HTTP markup smoke-test và Edge headless desktop/mobile đạt.
- Commit/push: cập nhật bằng kết quả Git của phiên này.
- Known issues: Auth protection thuộc Task 05; feature navigation targets chưa có page cho tới task tương ứng.

---

## 2026-07-27 — Task 00 Supabase foundation

- Summary: Cài dependency có khóa phiên bản; thêm Prisma 7 config/client, Supabase SSR/Auth/Storage helpers và env contract.
- Files: package manifest/lockfile, Prisma config/schema, `src/lib`, `.env.example`, `.gitignore`, README, Task 00 và project-log.
- Database impact: Không kết nối hoặc thay đổi database; không tạo migration/cloud resource.
- Validation: Prisma validate/generate, lint, typecheck và build đạt. Audit ghi nhận 7 advisory không có auto-fix an toàn.
- Commit/push: cập nhật bằng kết quả Git của phiên này.
- Known issues: Chưa có Supabase project/credential; dependency advisories được theo dõi trong `ISSUES.md`.

---

## 2026-07-27 — Task 02 Design Foundation

- Summary: Thêm Midnight Blue Aurora tokens, Geist typography và UI/data-state primitives responsive.
- Files: layout/global CSS, home preview, `src/components/ui`, `src/lib/cn.ts`, package manifest/lockfile và project-log.
- Database impact: Không có.
- Validation: lint, typecheck, build đạt; browser desktop/mobile không overflow/error overlay; contrast chính đạt WCAG AA.
- Commit: `bfdf5e1` (`feat(design): add CoffeeHub UI foundation`).
- Push result: Chuẩn bị push lên `origin/dev` trong phiên Task 02.
- Known issues: Dependency advisories và artifact task legacy không thay đổi.

---

## 2026-07-27 — Task 01 Repository Audit

- Summary: Audit framework, dependency, router, source, database/auth/PWA artifacts, security boundaries và task tracker.
- Files: `docs/REPOSITORY_AUDIT.md`, Task 01 và project-log.
- Database impact: Không có.
- Validation: lint, typecheck, build và dev HTTP smoke-test đạt; production audit báo 3 high advisory.
- Commit: `7b3a746` (`docs(repository): audit current application state`).
- Push result: Chuẩn bị push lên `origin/dev` trong phiên Task 01.
- Known issues: 16 task file legacy trùng roadmap và dependency advisories đã được ghi rõ.

---

## 2026-07-27 — Task 00 Bootstrap

- Summary: Xác minh môi trường Next.js hiện có, bổ sung hướng dẫn setup và hoàn tất trạng thái bootstrap.
- Files: README, package lock, task/project-log và bộ tài liệu điều phối đang chờ commit.
- Database impact: Không có.
- Validation: `npm install`, lint, typecheck, build và dev HTTP smoke-test đều đạt; chưa có test script.
- Commit: `e46973b` (`chore(bootstrap): verify project environment`).
- Push result: Chuẩn bị push lên `origin/dev` trong phiên Task 00.
- Known issues: Task files trùng số và dependency advisories đã ghi trong `ISSUES.md`.

---

Mỗi entry mới dùng mẫu:

```text
Date:
Task:
Summary:
Files:
Database impact:
Validation:
Commit:
Push result:
Known issues:
```
# 2026-07-27 — Supabase documentation architecture

- Đọc và rà soát toàn bộ Markdown trong repository.
- Chuyển backend đích sang Supabase PostgreSQL/Auth/Storage; giữ Prisma cho data access nghiệp vụ.
- Bổ sung Admin/CMS, RLS, media, env, deployment, Free Plan, backup/recovery và portability.
- Mở lại phần Supabase của Task 00; cập nhật Task 04, 05, 07, 16 và 21.
- Xóa task legacy trùng số và tài liệu legacy không còn trách nhiệm vận hành.
- Commit/push: cập nhật sau kiểm tra.
