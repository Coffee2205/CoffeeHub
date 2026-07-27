# Task 21 — QA và deploy

## Trạng thái

Pending

## Mục tiêu

Kiểm tra toàn bộ sản phẩm, xử lý lỗi và deploy production

## Dependency

- `20-AI-PERSONAL-ASSISTANT.md` phải hoàn thành.

## Công việc

- [ ] Kiểm thử Supabase Auth: login/logout, persistence/refresh/expiry, protected route/mutation, user/admin và role metadata.
- [ ] Kiểm thử RLS: anonymous, owner, non-owner, admin, public-published/draft; không public-all hoặc service-role bypass trong luồng thường.
- [ ] Kiểm thử Storage public/private, signed URL, validation, overwrite/delete/orphan, alt/fallback và không lộ service role.
- [ ] Kiểm tra Prisma migration ở non-production, pooled runtime/direct migration env và rollback/restore rehearsal.
- [ ] Kiểm tra env Vercel/Supabase không in giá trị; export PostgreSQL, inventory/metadata và object Storage.
- [ ] Kiểm tra pagination/index/rate limit/upload limit/quota; dừng trước nâng gói hoặc billing.

- [ ] Lint/typecheck/build
- [ ] Unit/integration/E2E phù hợp
- [ ] Accessibility
- [ ] Responsive
- [ ] Security/ownership
- [ ] PWA test
- [ ] AI failure test
- [ ] Migration review
- [ ] Chuẩn bị Vercel deploy; production deploy chỉ sau xác nhận trực tiếp
- [ ] Domain/HTTPS
- [ ] Final README/handoff

## Không thực hiện

- Không bỏ qua lỗi bằng disable rule tùy tiện
- Không dùng production data cho test

## File dự kiến

- `README.md`
- `.env.example`
- `docs/DEPLOYMENT_HANDOFF.md`
- `project-log/*`

## Ảnh hưởng database

Review và chạy production migration theo quy trình.

## Tiêu chí hoàn thành

- Core flows đạt
- Không có lỗi nghiêm trọng
- Deploy thành công
- Known limitations rõ
- Handoff đầy đủ

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
- Manual test: Chưa chạy.
