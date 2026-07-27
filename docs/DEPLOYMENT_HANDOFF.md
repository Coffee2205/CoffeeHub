# Deployment và bàn giao — CoffeeHub

## Môi trường

Tối thiểu:

```text
Development
Preview
Production
```

Không dùng chung database production cho development nếu có thể tránh.

## Biến môi trường

Danh sách chính xác phải được tạo sau repository audit.

Nhóm dự kiến:

```text
DATABASE_URL
DIRECT_URL nếu Prisma/Neon cần
AUTH_SECRET hoặc biến auth tương ứng
APP_URL
OPENAI_API_KEY
GROQ_API_KEY
GEMINI_API_KEY
AI_PROVIDER_ORDER
```

Quy tắc:

- Không commit `.env`.
- Tạo `.env.example` chỉ chứa tên biến và hướng dẫn.
- Không dùng prefix public cho secret.
- Không in secret trong log hoặc screenshot.

## Database deployment

Trước production migration:

- Review schema diff.
- Kiểm tra destructive change.
- Backup hoặc xác định khả năng restore.
- Chạy migration ở preview/staging nếu có.
- Ghi migration vào changelog.

Không chạy `db push` tùy tiện trên production nếu project đã dùng migrations.

## Vercel

- Kết nối repository.
- Thiết lập environment cho từng môi trường.
- Kiểm tra build command.
- Kiểm tra Node version.
- Kiểm tra Prisma generate trong build.
- Thêm custom domain.
- Kiểm tra HTTPS.

## PWA validation

- Manifest trả về đúng.
- Icon đúng kích thước.
- Service worker đăng ký thành công.
- App mở standalone.
- Offline fallback không lộ dữ liệu cũ không phù hợp.
- Test iPhone Add to Home Screen.

## AI deployment

- Provider có thể bật/tắt riêng.
- Không deploy API key xuống client.
- Timeout và rate limit hoạt động.
- Fallback order được cấu hình.
- Khi không có provider khả dụng, UI báo lỗi rõ ràng.
- Không giả định ChatGPT Plus cung cấp API access.

## Kiểm tra trước bàn giao

- `lint` đạt.
- `typecheck` đạt nếu có script.
- `build` đạt.
- Core flow được kiểm thử thủ công.
- Authentication và ownership được kiểm tra.
- Không có demo secret.
- Không có dữ liệu cá nhân thật trong public pages.
- Project log được cập nhật.
- Task tương ứng được cập nhật.

## Tài liệu bàn giao

- README cài đặt.
- `.env.example`.
- Hướng dẫn migration.
- Hướng dẫn deploy.
- Hướng dẫn backup.
- Hướng dẫn bật/tắt AI provider.
- Known limitations.
- Danh sách việc chưa hoàn thành.
