# Task 01 — Roadmaps delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Roadmaps`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/04-roadmaps/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/04-roadmaps/tasks/01-delivery.md`

## Trạng thái

In Progress

## Mục tiêu

Tạo Roadmap và Stage gắn với Goal

## Dependency

- `tasks/epics/02-owner-workspace/features/03-goals/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Create Roadmap
- [x] Stage CRUD
- [x] Reorder stage
- [x] Milestone/status
- [x] Task relation placeholder hoặc thật
- [x] Progress calculation
- [x] Mobile layout implementation
- [ ] Browser verification desktop/mobile

## Không thực hiện

- Không tạo AI roadmap
- Không xóa Task khi xóa stage nếu chưa có rule

## File dự kiến

- `src/app/app/roadmaps/*`
- `src/features/roadmaps/*`

## Ảnh hưởng database

Có thể điều chỉnh relation/order constraint.

## Tiêu chí hoàn thành

- Stage order ổn định
- Transaction khi cần
- Ownership đúng
- Responsive
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/app/goals/[goalId]/page.tsx`
- `src/app/app/goals/[goalId]/roadmap/*`
- `src/features/roadmaps/*`
- `tests/roadmap-schema.test.ts`

### Quyết định kỹ thuật

- Roadmap nằm trong Goal detail để giữ context và ownership chain rõ ràng.
- Milestone status/progress được suy ra từ Task thật; Task bị hủy/xóa không được query vào progress.
- Reorder dùng transaction và vị trí tạm để không vi phạm unique `(roadmap_id, position)`.
- Mọi mutation ràng buộc đồng thời `userId`, `goalId`, `roadmapId` và `stageId` khi phù hợp.
- Không cần migration; schema, composite foreign key, index và RLS đã có từ database foundation.

### Vấn đề còn lại

- Chrome DevTools Protocol trực tiếp đã mở và tương tác được với production server, nhưng Supabase Auth từ chối credential E2E owner hiện có.
- Transaction rollback qua direct connection đã xác minh create Roadmap, create/reorder Stage và cleanup sạch.
- Task chưa được đánh dấu Completed cho đến khi browser desktop/mobile được xác minh bằng owner session hợp lệ.

### Kiểm tra

- Tests: Đạt, 48/48.
- Prisma validate: Đạt.
- Lint: Đạt.
- Typecheck: Đạt.
- Build: Đạt; `/app/goals/[goalId]/roadmap` có trong production build.
- HTTP smoke: Đạt, `/login` trả HTTP 200 từ production server tại port 3135.
- Browser runtime: Đạt; Chrome CDP mở `/login`, đọc DOM và submit form thật.
- Browser desktop: Blocked vì Supabase Auth từ chối `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` hiện có.
- Browser mobile: Blocked vì không tạo được owner session bằng credential hiện có.
- Manual persistence: Đạt; development transaction tạo Goal/Roadmap/hai Stage, reorder ổn định và rollback sạch, không để lại dữ liệu test.
