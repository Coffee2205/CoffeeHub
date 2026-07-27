# Task 07 — Admin and Content Management

## Trạng thái

Pending

## Mục tiêu

Xây dựng giao diện Admin/CMS để người dùng tự cập nhật thông tin và bổ sung dự án mà không sửa code hoặc thao tác database trực tiếp.

## Dependency

- `04-DATABASE-FOUNDATION.md` phải hoàn thành.
- `05-AUTHENTICATION.md` phải hoàn thành.
- `02-DESIGN-FOUNDATION.md` phải hoàn thành.

## Tài liệu cần đọc

- `docs/CONTENT_REQUIREMENTS.md`
- `docs/SITE_MAP.md`
- `docs/ARCHITECTURE_RULES.md`
- `docs/TECHNICAL_DESIGN.md`
- `docs/DESIGN_RULES.md`

## Công việc

### Nền tảng Admin

- [ ] Tạo layout và navigation `/admin`.
- [ ] Bảo vệ toàn bộ admin routes bằng authentication và authorization.
- [ ] Tạo dashboard quản trị với shortcut và trạng thái nội dung.
- [ ] Có loading, empty, error và permission-denied state.

### Content model

- [ ] Profile.
- [ ] Projects.
- [ ] Experiences.
- [ ] Skills.
- [ ] Education.
- [ ] Posts.
- [ ] Pages/sections.
- [ ] Navigation và footer links.
- [ ] FAQ.
- [ ] Site settings.
- [ ] SEO metadata.
- [ ] Media assets hoặc media references.

### CRUD và biên tập

- [ ] Tạo mới, xem, sửa và xóa mềm/ẩn khi phù hợp.
- [ ] Draft, published, hidden.
- [ ] Sắp xếp `displayOrder`.
- [ ] Upload hoặc chọn ảnh.
- [ ] Preview trước khi publish khi phù hợp.
- [ ] Inline validation và thông báo lưu thành công/thất bại.
- [ ] Xác nhận trước hành động phá hủy.

### Kết nối hiển thị

- [ ] Website công khai đọc nội dung từ database.
- [ ] App đọc site settings cần thiết từ database.
- [ ] Có fallback an toàn khi chưa có nội dung.
- [ ] Không giữ bản sao hard-code có thể gây lệch dữ liệu.

## Không thực hiện

- Không xây page builder kéo-thả tổng quát.
- Không cho phép sửa route, permission hoặc enum kỹ thuật từ CMS.
- Không public nội dung draft.
- Không chạy production migration.
- Không cho người không có quyền truy cập `/admin`.

## File dự kiến

- `src/app/admin/...`
- `src/features/admin/...`
- `src/features/content/...`
- `src/server/services/content/...`
- `src/server/repositories/content/...`
- `prisma/schema.prisma`
- `prisma/migrations/...`

Đường dẫn có thể thay đổi theo repository audit nhưng phải tuân thủ architecture rules.

## Ảnh hưởng database

Có. Ưu tiên schema rõ ràng cho từng entity thay vì một bảng JSON chung cho toàn bộ nội dung.

Các entity phải có trường ownership hoặc quyền quản trị phù hợp, timestamps và trạng thái publish. Migration phải additive và có rollback plan.

## Rủi ro

- Public nhầm nội dung draft.
- Upload file không an toàn.
- Admin route thiếu authorization.
- Dữ liệu hard-code và database hiển thị không đồng nhất.
- Xóa nội dung làm mất liên kết hoặc media.

## Tiêu chí hoàn thành

- Người dùng có thể đăng nhập và tự thêm/sửa/ẩn một dự án.
- Người dùng có thể cập nhật profile, kỹ năng, kinh nghiệm và học vấn.
- Người dùng có thể cập nhật nội dung công khai, menu/footer và SEO metadata.
- Thay đổi đã publish xuất hiện trên website/app mà không sửa code.
- Draft không xuất hiện công khai.
- Validation và authorization được kiểm tra.
- Không cần mở Prisma Studio hoặc Supabase/Neon dashboard cho hoạt động biên tập thông thường.
- Lint, typecheck, test/build liên quan đạt khi môi trường cho phép.
- Task và project-log được cập nhật.

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
- Test: Chưa chạy.
- Build: Chưa chạy.
- Manual test: Chưa chạy.
- Commit: Chưa tạo.
- Push `origin/dev`: Chưa thực hiện.
