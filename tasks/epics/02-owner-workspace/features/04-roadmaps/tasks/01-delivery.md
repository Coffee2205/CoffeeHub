# Task 01 — Roadmaps delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Roadmaps`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/04-roadmaps/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/04-roadmaps/tasks/01-delivery.md`

## Trạng thái

Completed

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
- [x] Browser verification desktop/mobile

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

- Không còn blocker trong phạm vi Task. Dữ liệu E2E đã được xóa sạch sau verification.

### Kiểm tra

- Tests: Đạt, 48/48.
- Prisma validate: Đạt.
- Lint: Đạt.
- Typecheck: Đạt.
- Build: Đạt; `/app/goals/[goalId]/roadmap` có trong production build.
- HTTP smoke: Đạt, `/login` trả HTTP 200 từ production server tại port 3135.
- Browser runtime: Đạt; Chrome CDP đăng nhập owner thật và chạy interaction end-to-end.
- Browser desktop: Đạt ở 1440×1000; create Goal/Roadmap, create/edit/reorder/archive Stage, progress, success state, không overflow hoặc error overlay.
- Browser mobile: Đạt ở 390×844; nội dung và milestone responsive, không overflow hoặc error overlay.
- Manual persistence: Đạt; development transaction tạo Goal/Roadmap/hai Stage, reorder ổn định và rollback sạch, không để lại dữ liệu test.
- Browser cleanup: Đạt; Goal E2E được archive qua UI, sau đó xóa đúng cây test đã biết; zero residue.
- Visible result URL: `/app/goals/[goalId]/roadmap`.
- Access: Owner đăng nhập.
- How to use: Mở một Goal, chọn “Mở Roadmap”, tạo Roadmap, thêm milestone, chỉnh sửa hoặc dùng nút lên/xuống để reorder; milestone không có Task có thể lưu trữ.
