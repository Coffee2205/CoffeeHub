# Database foundation

## Phạm vi

Supabase PostgreSQL là database duy nhất. Prisma quản lý schema/query nghiệp vụ; Supabase Auth cung cấp UUID trong `auth.users`. `public.users.id` dùng cùng UUID và có foreign key đến `auth.users.id` trong migration SQL.

## Quan hệ

```text
auth.users 1──1 users 1──1 profiles
                    ├──* goals 1──* roadmaps 1──* roadmap_stages
                    │       └──* tasks ────────┘
                    ├──* events
                    └──* notes
```

Mọi entity private có `user_id`, timestamps, `deleted_at` và `version`. Composite foreign keys trên Goal/Roadmap/Stage/Task buộc cả cây dữ liệu có cùng owner. Index bắt đầu bằng `user_id` cho query/RLS phổ biến; foreign key columns đều có index hỗ trợ.

## RLS và quyền

- Tất cả bảng `public` bật và force RLS.
- `anon` không có quyền trên dữ liệu foundation.
- `authenticated` chỉ CRUD row có `user_id = auth.uid()`; admin dùng role tin cậy trong `app_metadata`.
- Policy `FOR ALL` có cả `USING` và `WITH CHECK`, đồng thời bao gồm quyền SELECT cần cho UPDATE.
- Không có view, `SECURITY DEFINER`, public-all policy hoặc service-role application path.

## Migration và recovery

Migration khởi tạo là additive và nằm trong `prisma/migrations`. Trước migration lớn sau này phải export PostgreSQL và kiểm tra restore. Không sửa migration đã áp dụng; tạo migration mới.

Rollback cho database development trống: xóa các bảng theo thứ tự phụ thuộc rồi xóa ba enum và `private.set_updated_at`. Đây là destructive operation nên không được chạy tự động. Với database có dữ liệu, ưu tiên forward migration thay vì rollback phá hủy.

## Seed

Seed chỉ chạy khi có `SEED_USER_ID` trỏ tới user Supabase Auth đã tồn tại và `DATABASE_URL` development. Script idempotent, dùng transaction và dữ liệu demo tổng quát. Không chạy seed trên production.
