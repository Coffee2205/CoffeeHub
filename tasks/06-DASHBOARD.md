# Task 06 — Dashboard

## Trạng thái

Completed — 2026-07-27

## Mục tiêu

Tạo Dashboard đọc dữ liệu thật và hiển thị tổng quan ngày/tuần.

## Dependency

- `05-AUTHENTICATION.md` đã hoàn thành.

## Công việc

- [x] Welcome summary theo thời điểm và Profile/email fallback.
- [x] Task hôm nay và quá hạn.
- [x] Goal đang hoạt động cùng tiến độ Task.
- [x] Event sắp tới trong 7 ngày.
- [x] Weekly progress có định nghĩa rõ.
- [x] Loading, empty và error states.
- [x] Responsive mobile/desktop.

## Không thực hiện

- Không thêm AI insight thật hoặc placeholder giả.
- Không dùng số liệu giả trong production.
- Không thêm mutation của Goal/Task/Event trước task tương ứng.

## Ảnh hưởng database

Không đổi schema hoặc migration. Query dùng index hiện có và luôn scope theo verified `userId`.

## Tiêu chí hoàn thành

- [x] Dashboard đọc dữ liệu theo user hiện tại.
- [x] Số liệu và time boundary được ghi rõ trong `docs/DASHBOARD.md`.
- [x] Responsive, semantic states và progressbar accessibility.
- [x] Test/lint/typecheck/build đạt.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/app/dashboard/{page,loading}.tsx`.
- `src/features/dashboard/*` gồm repository, service, date ranges, metrics, formatters, types và components.
- `src/lib/prisma.ts` chuyển sang lazy getter build-safe.
- `tests/dashboard.test.ts`, `docs/DASHBOARD.md`, Task 06 và project-log.

### Quyết định kỹ thuật

- Dashboard là Server Component; không ship client fetch/state khi chưa cần interaction.
- User ID lấy lại bằng `requireUser()` tại page và mọi Prisma query có ownership condition.
- UTC là boundary tạm thời minh bạch cho tới khi Profile có timezone preference.
- Weekly progress là completed/total Task có hạn trong tuần, bỏ Task canceled/deleted.
- Query count tách khỏi danh sách preview để metric không bị cap ở 4–5 record.
- Prisma client khởi tạo lazy để module import không yêu cầu env/database trong build sớm.

### Vấn đề còn lại

- Profile timezone chưa có; Dashboard hiện ghi rõ UTC.
- Database development chưa có account thật nên UI authenticated không được chụp bằng browser; query đã được kiểm thử với transaction data và rollback.

### Kiểm tra

- Unit tests: 6/6 đạt, gồm UTC range, greeting, weekly progress và Auth regression.
- Lint, typecheck, build: Đạt.
- Supabase transaction query: today=1, overdue=1, active goal=1, upcoming event=1; toàn bộ dữ liệu test đã rollback.
- React best-practices review: Đạt; Server Components, semantic list/time/progress, stable keys, không hook/effect thừa.
