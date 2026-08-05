# Code Formatting Workflow

Tài liệu này quy định cách coding agent định dạng code mới hoặc code vừa sửa trong mỗi phiên làm việc.

## Phạm vi

Chỉ format các file thuộc task hiện tại và có định dạng được Prettier hỗ trợ:

- TypeScript/JavaScript: `.ts`, `.tsx`, `.js`, `.jsx`
- Dữ liệu và style: `.json`, `.css`, `.scss`
- Tài liệu: `.md`

Không format hoặc sửa:

- `node_modules`, `.next`, `dist`, `build`, `out`;
- code generated, Prisma Client và build artifacts;
- lockfile nếu task không thay dependency;
- `.env*`, secret hoặc credential;
- file dirty không thuộc task hiện tại.

File Prisma và SQL migration được kiểm tra bằng Prisma/SQL validation phù hợp vì Prettier mặc định của dự án không có parser cho `.prisma` hoặc `.sql`.

## Quy trình bắt buộc

1. Chạy `git status --short` trước khi sửa và ghi nhận file dirty có sẵn.
2. Chỉ sửa/format file thuộc đúng Task/Subtask hiện tại; không dùng `prettier --write .` khi worktree có thay đổi không liên quan.
3. Sau khi viết code, chạy Prettier trên danh sách file đã sửa được hỗ trợ, ví dụ:

   ```powershell
   npx prettier --write src/path/file.ts src/path/component.tsx tests/example.test.ts
   ```

4. Chạy formatter check trên cùng phạm vi:

   ```powershell
   npx prettier --check src/path/file.ts src/path/component.tsx tests/example.test.ts
   ```

5. Chạy ESLint theo cấu hình repository:

   ```powershell
   npm run lint
   ```

6. Chạy `npm run typecheck`, test và build phù hợp với task.
7. Chạy `git diff --check` và đọc diff trước khi commit.

Nếu repository chưa khai báo Prettier cục bộ, được phép chạy phiên bản ổn định tạm thời qua `npx` mà không sửa `package.json` hoặc lockfile. Không dùng replace hàng loạt để tự mô phỏng formatter.

## Quy tắc an toàn

- Formatting không được thay đổi logic, API, schema, cấu trúc dữ liệu hoặc nội dung hiển thị.
- Không tự tách component, đổi tên biến hoặc refactor ngoài phạm vi task.
- JSX/TSX có props dài và phần tử lồng nhau phải để Prettier tách dòng nhất quán.
- Không chỉnh tay chuỗi, regex hoặc template literal chỉ để đạt bố cục đẹp hơn.
- Lỗi logic/type/lint không liên quan phải được ghi vào báo cáo, không sửa kèm nếu nằm ngoài task.

## Báo cáo cuối phiên

Báo cáo phải nêu:

- file nào đã được format;
- lệnh formatter check đã chạy và kết quả;
- kết quả lint, type-check, test/build;
- file dirty ngoài phạm vi được giữ nguyên;
- lỗi còn lại và nguyên nhân.
