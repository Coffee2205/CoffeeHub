# CoffeeHub Agent — Workflows

## 1. Xác định mode

### Bootstrap

Dùng khi một trong các điều kiện đúng:

- Không có `package.json`.
- Next.js chưa được khởi tạo.
- Không có `src/` hoặc `app/`.
- Cấu hình cốt lõi chưa tồn tại.
- Dependency chưa được cài hoặc project không thể build do chưa setup.
- Project-log hoặc task tracking chưa tồn tại.

### Development

Dùng khi project đã cài đặt và build được nhưng còn feature chưa hoàn thành.

### Maintenance

Dùng khi scope chính đã hoạt động và công việc chủ yếu là bugfix, refactor, accessibility, performance hoặc technical debt.

### Release

Dùng khi chuẩn bị preview, staging hoặc production.

---

## 2. Bootstrap workflow

### Mục tiêu

Biến repository trống hoặc chưa hoàn chỉnh thành môi trường CoffeeHub ổn định.

### Stack mặc định

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL/Neon
- Zod

Chỉ cài React Hook Form, PWA library hoặc dependency khác khi task thực tế cần. Không cài toàn bộ dependency tương lai ngay từ đầu.

### Trình tự

1. Xác định package manager từ lockfile; nếu chưa có, ưu tiên npm.
2. Khởi tạo Git nếu chưa có.
3. Khởi tạo Next.js nếu chưa có.
4. Bật TypeScript strict.
5. Cấu hình Tailwind và lint.
6. Tạo `.gitignore`, `.env.example` và README setup.
7. Tạo cấu trúc thư mục nền tảng.
8. Khởi tạo Prisma khi Task Database yêu cầu hoặc khi bootstrap task quy định rõ.
9. Cài dependency.
10. Chạy dev/build/lint/typecheck theo scripts hiện có.
11. Cập nhật project-log.
12. Chuyển sang Repository Audit.

### Không được

- Ghi đè ứng dụng hiện có.
- Kết nối production database.
- Thêm secret thật.
- Bật billing.
- Chạy migration phá hủy.
- Cài package không có lý do sử dụng ngay.

---

## 3. Development workflow

1. Đọc task và acceptance criteria.
2. Kiểm tra dependency.
3. Audit code liên quan.
4. Chia task lớn thành subtasks có thể kiểm tra.
5. Triển khai theo lát cắt dọc khi phù hợp:

```text
Schema/domain
→ Repository
→ Service
→ Server Action/API
→ UI
→ Loading/empty/error
→ Test
→ Documentation
```

6. Chạy kiểm tra.
7. Cập nhật task và project-log.
8. Commit và push thay đổi lên `origin/dev`.
9. Dừng phiên sau khi push thành công.
10. Chờ người dùng yêu cầu trước khi bắt đầu task kế tiếp.

---

## 4. Maintenance workflow

Thứ tự ưu tiên:

1. Security và data integrity.
2. Production-breaking bug.
3. Build/type/lint/test failure.
4. Functional bug.
5. Accessibility/performance regression.
6. Technical debt.
7. Cosmetic polish.

Quy trình bugfix:

1. Xác định expected behavior.
2. Tái hiện lỗi hoặc xác định failing path.
3. Tìm root cause nhỏ nhất.
4. Thêm regression test khi phù hợp.
5. Sửa tối thiểu.
6. Kiểm tra luồng liên quan.
7. Ghi root cause và giới hạn còn lại.

---

## 5. Release workflow

Trước release phải:

- Hoàn thành release-blocking tasks.
- Review environment variables.
- Review database migration.
- Chạy build, typecheck, lint và test có sẵn.
- Smoke test authentication, authorization và main flows.
- Kiểm tra responsive và PWA nếu thuộc scope.
- Cập nhật deployment handoff và rollback plan.

Không deploy hoặc chạy production migration khi chưa có xác nhận trực tiếp từ người dùng.


---

## 6. Quy tắc kết thúc phiên sau khi push

Mỗi yêu cầu của người dùng chỉ tương ứng với một task hoặc một đơn vị công việc đã được xác định rõ.

Sau khi agent:

1. Hoàn thành task hiện tại.
2. Chạy kiểm tra.
3. Cập nhật task và project-log.
4. Commit.
5. Push thành công lên `origin/dev`.

Agent phải:

- Báo cáo commit hash và kết quả push.
- Ghi rõ task kế tiếp được đề xuất nhưng không triển khai.
- Dừng hoàn toàn.
- Chờ yêu cầu mới từ người dùng.

Agent không được tự mở task kế tiếp, tự viết code tiếp, hoặc tiếp tục roadmap trong cùng phiên.
