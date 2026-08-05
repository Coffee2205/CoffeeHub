# Task 16 — PWA và offline

## Trạng thái

Pending

## Mục tiêu

Biến ứng dụng thành PWA và triển khai mutation queue an toàn

## Dependency

- `15-NOTIFICATIONS.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- **Route:** `/app/dashboard và installable PWA`
- **Luồng:** Cài PWA hoặc kiểm tra installability; mở shell/offline fallback khi mất mạng.
- Task không hoàn thành nếu route chỉ là placeholder hoặc chưa được browser-test desktop/mobile.

## Công việc

- [ ] Manifest/icons
- [ ] Service worker
- [ ] Install experience
- [ ] Offline fallback
- [ ] IndexedDB mutation queue
- [ ] Idempotency key
- [ ] Retry/backoff
- [ ] Online/offline/sync status
- [ ] Test desktop/iPhone
- [ ] Không cache token, auth response, signed URL hoặc dữ liệu private để dùng lại giữa session; logout xóa cache/queue nhạy cảm.
- [ ] Sync mutation đi qua server validation, Supabase Auth/AuthZ, service/repository/Prisma và RLS.
- [ ] Không bật Realtime cho toàn bộ bảng; nhu cầu thật phải có task và đánh giá quota riêng.

## Không thực hiện

- Không cache private response thiếu kiểm soát
- Không hứa full offline cho mọi feature

## File dự kiến

- `public/manifest*`
- `public/icons/*`
- `service worker config`
- `src/features/sync/*`

## Ảnh hưởng database

Có thể thêm IdempotencyRecord nếu backend chưa có.

## Tiêu chí hoàn thành

- Cài được trong môi trường hỗ trợ
- Offline fallback đúng
- Queue không duplicate
- Private cache an toàn
- Session hết hạn/offline không cho queue vượt quyền; retry không tạo record/media trùng.
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Chưa cập nhật.

### Quyết định kỹ thuật

- Chưa cập nhật.

### Vấn đề còn lại

- Chưa cập nhật.

### Kiểm tra

- Lint: Chưa chạy.
- Typecheck: Chưa chạy.
- Build: Chưa chạy.
- Visible result URL: Chưa có.
- How to use: Chưa cập nhật.
- Browser desktop: Chưa chạy.
- Browser mobile: Chưa chạy.
- Manual test: Chưa chạy.
