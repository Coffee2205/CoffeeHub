# Task 00 — Bootstrap project

## Trạng thái

Completed

## Mục tiêu

Khởi tạo và xác minh môi trường CoffeeHub để project có thể phát triển ổn định.

## Công việc

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

- Dependency cài thành công.
- Dev server có thể khởi động hoặc compile.
- Build thành công.
- Lint và typecheck thành công nếu được cấu hình.
- `.env.example` không chứa secret.
- README có hướng dẫn chạy project.
- `CURRENT_STATUS.md` chuyển sang mode Development.
- Task tiếp theo là Repository Audit.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Khởi tạo cấu hình Next.js, TypeScript strict, Tailwind CSS và ESLint.
- Tạo App Router tối thiểu trong `src/app`.
- Tạo `.gitignore`, `.env.example`, npm lockfile và bổ sung hướng dẫn setup vào README.
- Cập nhật task và project-log theo kết quả kiểm tra thực tế.

### Quyết định kỹ thuật

- Dùng npm vì repository ban đầu không có lockfile.
- Dùng Next.js 16 App Router và Server Components mặc định.
- Chỉ cài dependency bootstrap cốt lõi; hoãn Prisma và Zod đến task cần dùng.
- Khai báo rõ `turbopack.root` để không nhận nhầm lockfile ngoài repository.

### Vấn đề còn lại

- Chưa ghi nhận blocker. Repository Audit là task tiếp theo.

### Kiểm tra

- Install: `npm install` thành công.
- Dev: HTTP 200 tại `127.0.0.1:3100`, nội dung bootstrap được xác nhận và server đã dừng.
- Lint: `npm run lint` thành công.
- Typecheck: `npm run typecheck` thành công.
- Build: `npm run build` thành công với Next.js 16.2.12.
- Audit: `npm audit --omit=dev` báo 3 advisory high từ dependency bắc cầu của Next.js; chưa có đường nâng cấp tương thích do npm chỉ đề xuất downgrade phá vỡ.

### Git

- Commit: Sẽ được ghi sau khi tạo commit bootstrap.
- Push: Chưa thực hiện.
