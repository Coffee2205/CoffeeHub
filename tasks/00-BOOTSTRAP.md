# Task 00 — Bootstrap project

## Trạng thái

Completed

## Mục tiêu

Khởi tạo và xác minh môi trường CoffeeHub để project có thể phát triển ổn định.

## Dependency

Không có. Đây là task đầu tiên.

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

- Xác minh và giữ nguyên cấu hình Next.js, TypeScript, Tailwind và ESLint hiện có.
- Bổ sung lại hướng dẫn cài đặt, chạy dev và kiểm tra chất lượng trong `README.md`.
- Đồng bộ `package-lock.json` bằng `npm install`.
- Cập nhật task và project-log theo kết quả thực tế.

### Quyết định kỹ thuật

- Dùng npm theo `package-lock.json` hiện có.
- Giữ Next.js 16 App Router và Server Components làm mặc định.
- Không thêm Prisma, auth, CMS hoặc dependency của task tương lai.

### Vấn đề còn lại

- npm audit báo 12 advisory high, trong đó 3 advisory thuộc dependency production bắc cầu của Next.js; không chạy `audit fix --force` vì npm đề xuất thay đổi phá vỡ.
- Bộ task mới và một số task cũ đang cùng tồn tại với số trùng nhau; chuyển việc xác minh/xử lý sang Repository Audit để không xóa file ngoài phạm vi bootstrap.

### Kiểm tra

- Install: `npm install` thành công.
- Dev: HTTP 200 tại `127.0.0.1:3100`, có nội dung CoffeeHub và server đã dừng.
- Lint: `npm run lint` thành công.
- Typecheck: `npm run typecheck` thành công.
- Build: `npm run build` thành công với Next.js 16.2.12.
- Commit: Sẽ ghi sau khi tạo commit task.
- Push: Chưa thực hiện.
