# Task 01 — Notes and Autosave delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Notes and Autosave`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/07-notes-autosave/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/07-notes-autosave/tasks/01-delivery.md`

## Trạng thái

Completed

## Mục tiêu

Tạo Note editor có autosave, local draft và conflict detection

## Dependency

- `tasks/epics/02-owner-workspace/features/06-calendar/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Note list/editor
- [x] Debounce 800–1200ms
- [x] Không save lần render đầu
- [x] Save status
- [x] IndexedDB draft
- [x] Retry
- [x] Version conflict UI
- [x] Khôi phục draft

## Không thực hiện

- Không làm collaborative editing
- Không âm thầm overwrite conflict

## File dự kiến

- `src/app/app/notes/*`
- `src/features/notes/*`
- `src/features/sync/*`

## Ảnh hưởng database

Note cần version và timestamps; migration nếu thiếu.

## Tiêu chí hoàn thành

- Autosave không spam request
- Offline draft hoạt động
- Conflict được phát hiện
- Trạng thái rõ
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/app/notes/*`: danh sách, tìm kiếm, tạo mới và editor được bảo vệ bởi owner session.
- `src/features/notes/*`: validation, repository owner-scoped, Server Actions và UI editor.
- `src/features/sync/note-draft-store.ts`: IndexedDB draft store theo Note và user.

### Quyết định kỹ thuật

- Giữ nguyên schema `notes` hiện có vì đã có version, timestamps và owner RLS.
- Repository/service boundary không cho client hoặc AI truy cập database trực tiếp, phù hợp D-013.
- Update dùng expected version; payload retry trùng nội dung được xem là idempotent, conflict khác nội dung không bị overwrite âm thầm.

### Vấn đề còn lại

- Không còn blocker cho task này.

### Kiểm tra

- Lint: Đạt (`npm run lint`).
- Typecheck: Đạt (`npm run typecheck`).
- Test: Đạt 58/58 (`npm test`).
- Build: Đạt (`npm run build` ngoài sandbox; lần đầu trong sandbox bị `EACCES` khi Prisma prerender `/admin`).
- Supabase: `notes` có RLS và policy `owner_or_admin_all`; không cần migration.
- Manual test: authenticated desktop/mobile browser verification pass trên note editor; autosave, offline draft restore, retry và version conflict UI đều hoạt động.
