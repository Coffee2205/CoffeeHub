# Changelog

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
