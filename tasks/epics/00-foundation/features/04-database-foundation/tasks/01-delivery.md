# Task 01 — Database Foundation delivery

## Hierarchy

- Epic: `Foundation`
- Feature: `Database Foundation`
- Source roadmap item: `tasks/epics/00-foundation/features/04-database-foundation/FEATURE.md`
- Task path: `tasks/epics/00-foundation/features/04-database-foundation/tasks/01-delivery.md`

## Trạng thái

Completed — 2026-07-27

## Mục tiêu

Thiết lập Prisma trên Supabase PostgreSQL, schema cốt lõi, migration và lớp bảo vệ dữ liệu an toàn.

## Dependency

- `tasks/epics/00-foundation/features/03-app-shell/FEATURE.md` đã hoàn thành.

## Subtasks

- [x] Chốt model User/Profile, Goal, Roadmap, RoadmapStage, Task, Event, Note.
- [x] Chốt timestamps, soft delete và version.
- [x] Tạo index, composite ownership key và unique constraint cần thiết.
- [x] Tạo và áp dụng migration additive lên Supabase development project.
- [x] Tạo seed demo idempotent, yêu cầu UUID của Supabase Auth user có sẵn.
- [x] Kiểm tra relation ownership.
- [x] Ghi ERD và mô tả schema.
- [x] Giữ contract `DATABASE_URL` pooled và `DIRECT_URL` direct trong env; không log chuỗi kết nối.
- [x] Bật và force RLS cho toàn bộ bảng public; policy chỉ cho owner hoặc admin từ `app_metadata`.
- [x] Policy `UPDATE` có `SELECT`, `USING` và `WITH CHECK`; không tạo view expose.
- [x] Kiểm thử anonymous, owner, non-owner và admin; ghi quy trình migration/recovery.

## Không thực hiện

- Không thêm AI model đầy đủ trước Task 18.
- Không dùng production data làm seed.
- Không chạy destructive migration.

## Tiêu chí hoàn thành

- [x] Prisma validate/generate đạt.
- [x] Migration không mất dữ liệu; database ban đầu rỗng.
- [x] Mọi model private có đường gắn `userId`.
- [x] Migration Prisma/RLS lưu trong Git; service role không dùng cho query nghiệp vụ.
- [x] Seed không chứa dữ liệu cá nhân thật.
- [x] Build đạt.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `prisma/schema.prisma`, `prisma.config.ts`, `prisma/seed.ts`.
- `prisma/migrations/20260727160000_database_foundation/migration.sql`.
- `prisma/migrations/20260727161000_optimize_rls_initplan/migration.sql`.
- `prisma/migrations/20260727162000_cover_composite_foreign_keys/migration.sql`.
- `docs/DATABASE_FOUNDATION.md`, `.env.example`, package manifest/lockfile và project-log.

### Quyết định kỹ thuật

- `public.users.id` dùng cùng UUID với `auth.users.id`; các bảng private mang `user_id` trực tiếp.
- Khóa ngoại ghép `(resource_id, user_id)` ngăn liên kết tài nguyên khác chủ sở hữu ngay ở database.
- RLS dùng `auth.uid()` cho owner và `auth.jwt().app_metadata.role = admin`; không dùng user metadata.
- Seed chỉ chạy khi có `SEED_USER_ID` của Auth user development; không tạo identity giả và không chạy vì project hiện chưa có Auth user.
- Ba migration được Supabase ghi nhận lần lượt với version cloud `20260727133136`, `20260727133302`, `20260727133610`.

### Vấn đề còn lại

- Auth user/flow thuộc Task 05; database hiện rỗng nên advisor chỉ báo INFO rằng index chưa có traffic sử dụng.
- Dependency advisories hiện có tiếp tục được theo dõi trong project-log.

### Kiểm tra

- Prisma validate/generate: Đạt.
- Lint: Đạt.
- Typecheck: Đạt.
- Build: Đạt.
- Supabase security advisor: Đạt, không có lint.
- Supabase performance advisor: Không còn cảnh báo RLS init-plan hoặc foreign key thiếu index; chỉ còn INFO unused-index trên database rỗng.
- RLS transaction test: owner đọc/cập nhật được 1 bản ghi; non-owner đọc/cập nhật 0; admin đọc được 2; anon không có quyền SELECT; toàn bộ dữ liệu test đã rollback.
