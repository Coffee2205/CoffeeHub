# Task 00 — Bootstrap project

## Trạng thái

Completed

## Mục tiêu

Khởi tạo và xác minh môi trường CoffeeHub để project có thể phát triển ổn định.

## Dependency

Không có. Đây là task đầu tiên.

## Công việc

- [x] Cài và cấu hình Prisma cùng `@supabase/supabase-js`/`@supabase/ssr` theo phiên bản tương thích, có lockfile.
- [x] Tạo khung Prisma client, Supabase browser/server client, auth helper và Storage helper nhưng chưa tạo tài nguyên cloud.
- [x] Bổ sung `.env.example` với toàn bộ biến Supabase, database và AI cần thiết nhưng không có giá trị thật.
- [x] Ghi rõ pooled runtime connection và direct migration connection mà không hard-code format.

- [x] Kiểm tra repository và bảo toàn mọi file hiện có.
- [x] Xác định package manager từ lockfile; nếu chưa có thì dùng npm.
- [x] Khởi tạo Git nếu chưa tồn tại.
- [x] Khởi tạo Next.js với TypeScript, App Router và Tailwind nếu chưa tồn tại.
- [x] Bật TypeScript strict.
- [x] Tạo `.gitignore`, `.env.example` và hướng dẫn setup trong README.
- [x] Tạo cấu trúc thư mục nền tảng phù hợp tài liệu kiến trúc.
- [x] Chỉ cài dependency cốt lõi cần dùng ngay.
- [x] Chạy install, dev, lint, typecheck và build theo script thực tế.
- [x] Cập nhật project-log bằng kết quả đã xác minh.

## Không thực hiện

- Không kết nối production database.
- Không thêm secret thật.
- Không bật billing.
- Không cài toàn bộ dependency cho các phase tương lai.
- Không bắt đầu feature UI ngoài nền tảng tối thiểu.
- Không chạy migration phá hủy.

## Ảnh hưởng database

Không tạo hoặc thay đổi production database. Prisma chỉ được khởi tạo nếu cần cho cấu trúc nền tảng và không kết nối production.

## Tiêu chí hoàn thành

- Prisma validate/generate và Supabase client imports đạt; secret không lọt vào client bundle hoặc log.
- Bootstrap không tạo project/bucket, không chạy cloud migration và không bật billing.

- Dependency cài thành công.
- Dev server có thể khởi động hoặc compile.
- Build thành công.
- Lint và typecheck thành công nếu được cấu hình.
- `.env.example` không chứa secret.
- README có hướng dẫn chạy project.
- `CURRENT_STATUS.md` chuyển sang mode Development.
- Task tiếp theo là App Shell vì Repository Audit và Design Foundation đã hoàn thành.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Thêm Prisma 7 schema/config, generated-client workflow và singleton PostgreSQL adapter.
- Thêm Supabase browser/server SSR clients, verified-claims helper, Storage validation và env boundary helpers.
- Khóa dependency Prisma/Supabase; cập nhật `.env.example`, `.gitignore` và README.

- Xác minh và giữ nguyên cấu hình Next.js, TypeScript, Tailwind và ESLint hiện có.
- Bổ sung lại hướng dẫn cài đặt, chạy dev và kiểm tra chất lượng trong `README.md`.
- Đồng bộ `package-lock.json` bằng `npm install`.
- Cập nhật task và project-log theo kết quả thực tế.

### Quyết định kỹ thuật

- Runtime dùng `DATABASE_URL` pooled qua `@prisma/adapter-pg`; Prisma CLI dùng `DIRECT_URL` direct.
- Anon key phục vụ user context. Service role chỉ có server env accessor và chưa được dùng.
- Auth proxy, domain model, migration và bucket thuộc task sau.

- Dùng npm theo `package-lock.json` hiện có.
- Giữ Next.js 16 App Router và Server Components làm mặc định.
- Ở lần bootstrap Next.js ban đầu chưa thêm Prisma/auth/CMS; quyết định này được thay thế cho phần foundation bởi kiến trúc Supabase ngày 2026-07-27.

### Vấn đề còn lại

- Chưa có Supabase project/credential nên xác minh bằng placeholder không nhạy cảm, không query database.
- Audit báo 7 advisory (1 moderate, 6 high) qua Prisma tooling và Next.js transitive; không dùng `--force` vì có thay đổi phá vỡ.

- npm audit báo 12 advisory high, trong đó 3 advisory thuộc dependency production bắc cầu của Next.js; không chạy `audit fix --force` vì npm đề xuất thay đổi phá vỡ.
- Các task legacy trùng số đã được xử lý trong phiên chuẩn hóa tài liệu trước khi mở lại Task 00.

### Kiểm tra

- Prisma validate/generate, lint, typecheck và production build đạt.
- Supabase helpers import/typecheck đạt; không tạo cloud resource hoặc billing.
- Dependency audit hoàn tất; 7 advisory được ghi nhận.
- Commit/push: cập nhật bằng kết quả Git của phiên này.

- Install: `npm install` thành công.
- Dev: HTTP 200 tại `127.0.0.1:3100`, có nội dung CoffeeHub và server đã dừng.
- Lint: `npm run lint` thành công.
- Typecheck: `npm run typecheck` thành công.
- Build: `npm run build` thành công với Next.js 16.2.12.
- Commit: `e46973b` (`chore(bootstrap): verify project environment`).
- Push: Chuẩn bị push lên `origin/dev` trong phiên Task 00.
