# CoffeeHub Agent Kit

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

Đưa cho coding agent nội dung trong [`START_AGENT.md`](START_AGENT.md).

## Chạy ứng dụng cục bộ

Yêu cầu Node.js 20.9 trở lên và npm. Cài dependency rồi khởi động dev server:

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

Khi dự án bắt đầu dùng biến môi trường, sao chép `.env.example` thành `.env.local`. Không commit `.env.local` hoặc secret thật.

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
