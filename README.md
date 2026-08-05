# CoffeeHub Agent Kit

Kiến trúc đích: Next.js/React/TypeScript/Tailwind trên Vercel; Supabase PostgreSQL/Auth/Storage ở backend; Prisma cho data access nghiệp vụ; AI theo OpenAI → Groq → Gemini. Nội dung thay đổi sau bàn giao phải quản trị được qua Admin/CMS.

Bộ tài liệu điều phối coding agent phát triển CoffeeHub theo quy trình:

```text
Nhận yêu cầu
→ đọc trạng thái
→ chọn đúng một task
→ triển khai
→ kiểm tra
→ cập nhật tài liệu
→ commit
→ push lên origin/dev
→ dừng
```

## Bắt đầu nhanh

Đưa cho coding agent nội dung trong [`PROMPT_CONTINUE_COFFEEHUB.md`](PROMPT_CONTINUE_COFFEEHUB.md). `START_AGENT.md` là entry point rút gọn.

## Chạy ứng dụng cục bộ

Yêu cầu Node.js 20.19 trở lên và npm. Cài dependency rồi khởi động dev server:

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Trước khi commit thay đổi code, chạy:

```bash
npm run lint
npm run typecheck
npm run build
```

Sao chép `.env.example` thành `.env.local` và thay placeholder bằng giá trị của môi trường được cấp. Không commit `.env.local`, connection string hoặc secret thật.

`DATABASE_URL` là kết nối pooled dùng ở runtime. `DIRECT_URL` là kết nối direct dành cho Prisma migration và công cụ backup. Luôn lấy cả hai từ Supabase tại thời điểm cấu hình; không suy đoán hoặc hard-code định dạng kết nối.

Trước khi chạy ứng dụng sau khi clone hoặc thay đổi Prisma schema:

```bash
npm run prisma:validate
npm run prisma:generate
```

Bootstrap chỉ tạo client/helper cục bộ. Nó không tạo Supabase project, bucket, schema cloud hay chạy migration.

## Thứ tự đọc chính

1. [`MANIFEST.md`](MANIFEST.md)
2. [`agent/MASTER.md`](agent/MASTER.md)
3. Các file được `MASTER.md` yêu cầu
4. Task hiện tại trong [`tasks/`](tasks/)
5. Tài liệu nghiệp vụ hoặc kỹ thuật liên quan trong [`docs/`](docs/)
6. Trạng thái dự án trong [`project-log/`](project-log/)

## Nguyên tắc quan trọng

- Mỗi phiên chỉ thực hiện một task hoặc một subtask rõ ràng.
- Sau khi push thành công lên `origin/dev`, agent phải dừng.
- Không push lên `main`, không force push.
- Nội dung thường xuyên thay đổi phải quản trị được từ giao diện Admin/CMS, không hard-code.
- Người dùng không cần sửa code hoặc thao tác database trực tiếp để cập nhật hồ sơ, dự án, bài viết, menu, footer, SEO và nội dung công khai.
- Thay đổi cấu trúc dữ liệu, logic nghiệp vụ hoặc bố cục mới vẫn có thể cần một task code riêng.


## Làm việc ở các phiên tiếp theo

Sau lần khởi động đầu tiên, không cần viết lại prompt dài.

Chỉ cần gửi agent:

```text
Đọc `agent/CONTINUE.md` và tiếp tục task hiện tại.
```

Roadmap được tổ chức theo:

```text
Epic → Feature → Task → Subtask
```

Điều này cho phép thêm task mới mà không phải đánh lại số toàn bộ dự án.
