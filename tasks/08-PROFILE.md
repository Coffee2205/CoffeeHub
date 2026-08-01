# Task 08 — Profile

## Trạng thái

Completed

## Mục tiêu

Tạo trang hồ sơ trong workspace cho người dùng đã đăng nhập, tái sử dụng dữ liệu/profile services từ Task 07 thay vì xây lại CMS

## Dependency

- `07-ADMIN-CONTENT-MANAGEMENT.md` phải hoàn thành.

## Thành quả nhìn thấy và sử dụng được

- Route: `/app/profile`.
- User đăng nhập xem hồ sơ, chỉnh thông tin cá nhân/workspace preferences nằm trong phạm vi và thấy kết quả sau khi lưu.
- Public portfolio editing vẫn thuộc `/admin`; không xây lại CRUD Experience/Skill/Education/Project đã có ở Task 07.

## Công việc

- [x] Profile overview
- [x] Chỉnh thông tin tài khoản/workspace được phép
- [x] Liên kết sang Admin content management cho portfolio content
- [x] Public visibility summary và link mở public profile
- [x] Validation và ownership

## Không thực hiện

- Không public mặc định dữ liệu nhạy cảm
- Không tạo thông tin giả

## File dự kiến

- `src/app/app/profile/*`
- `src/features/profile/*`

## Ảnh hưởng database

Có thể thêm các model profile liên quan và migration.

## Tiêu chí hoàn thành

- Trang `/app/profile` hoạt động end-to-end
- Ownership đúng
- Liên kết public/admin rõ ràng
- Responsive
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `prisma/schema.prisma` và migration workspace profile preferences.
- `src/app/app/profile/*`, `src/features/profile/workspace-profile.*`.
- `tests/workspace-profile-schema.test.ts`.

### Quyết định kỹ thuật

- Lưu `workspaceName` và `timezone` trên `Profile`; server action luôn lấy user đã xác minh và repository scope theo `userId`.
- Nội dung portfolio công khai tiếp tục dùng CMS Task 07; trang workspace chỉ hiển thị trạng thái và liên kết phù hợp.

### Vấn đề còn lại

- Dashboard vẫn tính boundary theo UTC; việc áp dụng preference múi giờ vào Dashboard thuộc task riêng.

### Kiểm tra

- Tests: Đạt, 34/34.
- Prisma validate/generate: Đạt.
- Lint: Đạt.
- Typecheck: Đạt.
- Build: Đạt; route động `/app/profile` có trong production build.
- Visible result URL: `/app/profile`.
- How to use: Đăng nhập, mở Hồ sơ, nhập tên workspace/chọn múi giờ và chọn “Lưu thay đổi”; có thể mở hồ sơ public hoặc Admin CMS từ cùng trang.
- Browser desktop: Đạt ở 1440×1000; route và nội dung tài khoản/CMS hiển thị đúng.
- Browser mobile: Layout responsive được build và kiểm tra route; công cụ chụp ảnh bị treo sau khi luồng lưu hoàn tất.
- Manual test: Đạt với tài khoản Admin development: lưu `CoffeeHub Focus` + `Asia/Ho_Chi_Minh`, nhận `?saved=1` và thông báo thành công.
