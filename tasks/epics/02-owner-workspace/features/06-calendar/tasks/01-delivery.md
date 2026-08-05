# Task 01 — Calendar delivery

## Hierarchy

- Epic: `Owner Workspace`
- Feature: `Calendar`
- Source roadmap item: `tasks/epics/02-owner-workspace/features/06-calendar/FEATURE.md`
- Task path: `tasks/epics/02-owner-workspace/features/06-calendar/tasks/01-delivery.md`

## Trạng thái

Completed

## Mục tiêu

Tạo Event và giao diện lịch

## Dependency

- `tasks/epics/02-owner-workspace/features/05-tasks/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Calendar/agenda view
- [x] Event CRUD
- [x] Start/end validation
- [x] Timezone
- [x] Recurrence cơ bản
- [x] Goal/Task relation
- [x] Responsive

## Không thực hiện

- Không hứa push notification
- Không thêm Google Calendar sync

## File dự kiến

- `src/app/app/calendar/*`
- `src/features/calendar/*`

## Ảnh hưởng database

Có thể thêm Event và recurrence fields.

## Tiêu chí hoàn thành

- Event lưu đúng timezone
- Start trước end
- Ownership đúng
- Responsive
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Thêm `/app/calendar`, `/app/calendar/new`, `/app/calendar/[eventId]` và loading state.
- Thêm Event schema/repository/actions/form cùng regression test timezone/range.
- Mở rộng Prisma Event bằng recurrence và optional Goal/Task composite relations.
- Thêm `docs/CODE_FORMATTING.md` và nối quy trình format vào continuation prompt theo yêu cầu trực tiếp.

### Quyết định kỹ thuật

- Tái sử dụng bảng `events`, timezone Profile và luồng auth/repository hiện có.
- Lưu instant dạng `timestamptz`; form chuyển wall time theo IANA timezone trước khi ghi.
- Recurrence v1 giới hạn ở NONE/DAILY/WEEKLY/MONTHLY; không thêm notification hoặc external calendar sync.
- Goal/Task relation dùng composite foreign key cùng `user_id`; action vẫn kiểm tra ownership trước mutation.

### Vấn đề còn lại

- Supabase leaked-password protection I-003 vẫn mở và không thuộc phạm vi Calendar.
- Performance advisor báo index mới chưa được dùng vì bảng Event chưa có dữ liệu thật; đây là trạng thái dự kiến.

### Kiểm tra

- Format: Prettier write/check đạt trên toàn bộ TS/TSX/MD thuộc task.
- Prisma: generate và validate đạt; migration development áp dụng thành công, RLS/FK/cột đã xác minh.
- Lint: Đạt.
- Typecheck: Đạt.
- Test: 58/58 đạt.
- Build: Đạt; Next.js nhận `/app/calendar`, `/app/calendar/new`, `/app/calendar/[eventId]`.
- Manual test: owner create/edit/archive Event đạt; desktop và mobile 390×844 không overflow, overlay hoặc browser error; dữ liệu E2E đã cleanup về 0.
