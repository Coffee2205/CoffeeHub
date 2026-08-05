# Changelog

## 2026-08-04 — Production profile avatar replacement

- Repointed the published Profile avatar to the newly uploaded `DSC_0011 (1).jpg` object in the existing private `profile-avatars` owner folder.
- Verified the replacement is a complete 555,122-byte JPEG and renders on `coffeehub.id.vn`, then permanently removed the superseded avatar through the Supabase Storage API.
- No schema, migration or application code changed.

## 2026-08-04 — Mobile owner login access

- Replaced the mobile header `Contact` CTA with `Đăng nhập`, keeping one clear owner-login entry point without adding a secondary row.
- Verified Supabase Production password auth returns tokens and the native mobile Server Action responds `303` to `/app/dashboard` with an auth cookie.

## 2026-08-04 — Public Activities line-break fix

- Normalized escaped `\\n`/`\\r\\n` and PowerShell-style `` `n ``/`` `r`n `` sequences before CMS content is persisted.
- Applied the same normalization while rendering Activities so existing published content displays correctly without a database migration.
- Added regression coverage for escaped multiline content.

## 2026-08-04 — Ongoing project option

- Added an Admin checkbox for projects that are still in progress; enabling it requires a start date, disables the end-date input and persists the existing `ended_at = null` representation.
- Added server validation so a forged/stale end date is ignored while the ongoing option is active.
- Public project cards and detail pages, plus the Admin project list, now display `Đang thực hiện` for ongoing projects.
- Reused the existing Project model without a migration. Typecheck, lint, 54 tests, production build and Admin/public desktop/mobile browser verification pass; the temporary E2E project was soft-deleted through Admin.

## 2026-08-04 — Tasks delivery completed

- Completed the protected `/app/tasks` list, create/edit/detail, status, priority, deadline, owner-scoped Goal/Roadmap/Stage relations, search/filter and archive flow.
- Fixed the quick-complete interaction so the optimistic state settles and the Server Component badge/filter refreshes after a successful mutation; error paths still roll back the local state.
- Reused the existing Task schema, composite ownership constraints, indexes and RLS; no migration was required.
- Passed typecheck, lint, 51/51 tests, production build and authenticated browser verification at desktop 1440×1000 and mobile 390×844 with no overflow or browser errors.
- Created, edited, toggled and archived the exact E2E Task through the UI; no active E2E Task remains.

## 2026-08-04 — Public CV Experience and Polish completed

- Replaced the CoffeeHub marketing-style home with the owner's database-backed CV and neutral unpublished states.
- Added published Profile, Objective, grouped Skills, Experience, Projects, Education, Certifications, Activities and Contact rendering plus dynamic Privacy/Terms pages.
- Kept `/` public for anonymous and authenticated owner sessions; owner receives Dashboard/Manage CV actions without redirect.
- Removed Gmail/auth-email name inference from workspace header, sidebar, profile and Dashboard fallbacks.
- Reused the existing schema and RLS; no migration or SQL write. Reference content was entered and published through Admin/CMS in the development database.
- Passed typecheck, lint, 51/51 tests, production build, diff check, anonymous desktop/mobile and authenticated owner browser verification.

## 2026-08-03 — Public CV and AI requirements alignment

- Reframed `/` as the owner's database-backed public CV instead of a CoffeeHub marketing landing page.
- Added a structured content reference from the supplied CV, including privacy defaults for phone, birth date, gender and auth email.
- Defined multi-turn chatbot behavior and confirmed structured actions for Goal/Roadmap/Task/Checklist/Event/Note through existing Feature Services.
- Updated canonical tasks, decisions, technical/security rules, next-step priority and the reusable continuation prompt.
- Documentation-only kit update; no application code, database, deployment, Git commit or push was performed in this review package.

## 2026-08-03 — Roadmaps delivery completed

- Completed authenticated owner verification for Goal Roadmaps on desktop 1440×1000 and mobile 390×844.
- Passed create Roadmap, create/edit/reorder/archive milestone, progress rendering, responsive layout, no overflow and no framework error overlay.
- Verified database transaction rollback separately; archived the browser Goal through UI and deleted the exact E2E tree afterward with zero residue.
- Feature and Task are Completed; Tasks is the next ready Feature.

## 2026-08-03 — Roadmaps verification follow-up

- Verified Roadmap creation, two Stage inserts, stable transactional reorder and zero-residue rollback against Supabase development via the direct connection.
- Replaced the failed browser CLI path with working Chrome CDP automation and confirmed the real login form can be rendered and submitted.
- Supabase Auth rejected the configured E2E owner credential, so authenticated desktop/mobile Roadmap verification remains pending and the Task stays In Progress.

## 2026-08-03 — Roadmaps implementation (verification pending)

- Added the protected Goal Roadmap route with roadmap creation, milestone CRUD, transactional reorder and Task-derived progress.
- Bound every milestone mutation to the verified owner and its Goal/Roadmap chain; added validation/progress regression tests.
- Verified 48/48 tests, Prisma schema, lint, typecheck, production build and HTTP 200 smoke test.
- Browser desktop/mobile and live persistence verification remain blocked by the automation/database environment, so the Task stays In Progress.

## 2026-08-02 — AI Foundation architecture and mock flow

- Summary: Added proposal-only AI architecture and an authenticated `/app/ai` Mock Provider workflow with runtime validation, editable preview and disabled persistence.
- Architecture: Typed actions/config/policies, provider registry/stubs, schemas, context builder, prompt library, mappers, normalized errors, usage metadata and persistence contracts.
- Network/database: No real AI provider calls, SDKs, keys, migrations or database writes.
- Validation: 46 tests, lint, typecheck, Prisma generate + Next.js production build; owner desktop/mobile browser flow passed with zero external AI resource requests.
- Known limitations: Real adapters, persistent rate limiting/audit logs, database-backed contexts and confirmation/save remain future tasks.

---

## 2026-08-02 — Workspace Profile delivery

- Summary: Completed `/app/profile` with an owner-scoped portfolio snapshot, published counts and Admin-only links to existing Profile, Resume and Project CRUD.
- Files: Workspace Profile page/repository, active Feature/Task and project-log.
- Database impact: None; existing Profile and CMS content models are reused.
- Validation: 41 tests, lint, typecheck, Prisma generate + Next.js production build; authenticated desktop/mobile browser verification passed without overflow, overlay or browser errors.
- Known issues: Public CV Experience and Polish remains dependency-blocked by PWA/Offline; Supabase leaked-password protection remains tracked in I-003.

---

## 2026-08-02 — Task 07D final public/preview/access delivery

- Summary: Added Experience, Skill and Education to Admin Preview and completed final public, owner and Admin access verification.
- Files: Admin preview repository/page, active Epic/Feature/Task and project-log.
- Database impact: None; read-only queries use existing content models.
- Validation: 41 tests, lint, typecheck, Prisma generate + Next.js production build; anonymous public desktop/mobile, protected Admin redirect, owner dashboard and Admin Preview desktop/mobile passed without overflow or browser errors.
- Known issues: Supabase leaked-password protection remains tracked separately in I-003; deeper public CV polish belongs to Feature 02.

---

## 2026-08-02 — Task 07C4 avatar media reconciliation

- Summary: Reconciled the existing avatar media implementation from `2d831cb` with the active Epic Task and verified its current code and live Supabase state.
- Files: Active Task and project-log only; implementation code was already committed and remained unchanged.
- Database impact: No mutation. Verified avatar columns, private `profile-avatars` bucket (5 MB; JPEG/PNG/WebP), and four Storage RLS policies. Post-E2E checks found no test metadata or objects.
- Validation: 41 tests, lint, typecheck, Prisma generate + Next.js production build passed. Fresh authenticated browser automation timed out in its CLI orchestration layer and is not claimed as a pass.
- Known issues: Supabase Security Advisor reports leaked-password protection disabled at project level; this is unrelated to 07C4. 07D remains.

---

## 2026-08-02 — Access-model alignment

- Summary: Removed public signup, constrained owner redirects to `/app` and `/admin`, returned logout to the public CV, and disabled signup in Supabase Auth.
- Files: Login action/form/page, auth redirect helper/tests, ESLint generated-output ignore, active Task and project-log.
- Database impact: No schema or data change; Supabase Auth configuration now has `disable_signup: true`.
- Validation: 41 tests, lint, typecheck, Prisma generate + Next.js production build, anonymous desktop/mobile browser rendering, and protected-route redirects passed.
- Known issues: Authenticated browser input through the temporary CLI timed out and is not claimed as a pass; 07C4 and 07D remain.

---

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
