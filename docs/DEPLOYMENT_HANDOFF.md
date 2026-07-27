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
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
DATABASE_URL
DIRECT_URL
OPENAI_API_KEY
GROQ_API_KEY
GOOGLE_GENERATIVE_AI_API_KEY
AI_PROVIDER_ORDER
```

Quy tắc:

- Không commit `.env`.
- Tạo `.env.example` chỉ chứa tên biến và hướng dẫn.
- Không dùng prefix public cho secret.
- Không in secret trong log hoặc screenshot.
- Chỉ `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` được dùng phía client. Database URLs, AI keys và secret key quản trị nếu một task tương lai thực sự cần đều chỉ được đặt ở server.
- `DATABASE_URL` dành cho runtime pooled; `DIRECT_URL` dành cho migration/backup theo chuỗi Supabase cung cấp tại thời điểm cấu hình. Không sao chép connection string thật vào tài liệu hay log.

## Database deployment

Trước production migration:

- Review schema diff.
- Kiểm tra destructive change.
- Backup hoặc xác định khả năng restore.
- Chạy migration ở preview/staging nếu có.
- Ghi migration vào changelog.

Không chạy `db push` tùy tiện trên production nếu project đã dùng migrations.

RLS policies và Storage policies phải đi cùng migration có review. Kiểm tra ít nhất anonymous, authenticated owner, authenticated non-owner và admin; không xem UI ẩn menu là kiểm soát quyền.

## Supabase và khả năng phục hồi

- Tách project/environment theo nhu cầu và quota thực tế; không tự tạo thêm project hoặc nâng gói.
- Xác minh giới hạn Free Plan hiện hành trước handoff, cấu hình cảnh báo quota khi gói hỗ trợ và dừng xin xác nhận trước mọi chi phí.
- Trước migration lớn, tạo bản export PostgreSQL có thể kiểm tra restore; schema và Prisma migrations luôn ở Git.
- Export riêng danh sách bucket/object cùng metadata/path tham chiếu trong database và sao lưu object cần thiết. Backup database không đồng nghĩa backup file Storage.
- Recovery runbook ghi rõ thứ tự: restore database, restore objects, đối soát path/reference, rồi smoke test Auth/RLS/media.
- Portability runbook dùng định dạng PostgreSQL chuẩn và repository/service; không dựa Supabase SDK cho query nghiệp vụ thông thường.

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
