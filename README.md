# CoffeeHub Complete Agent Kit

Bộ tài liệu này là nguồn thông tin chính để coding agent có thể khởi tạo, phát triển, bảo trì và chuẩn bị phát hành CoffeeHub.

## Chạy dự án cục bộ

Yêu cầu Node.js 20.9 trở lên và npm.

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Các kiểm tra trước khi commit:

```bash
npm run lint
npm run typecheck
npm run build
```

Khi dự án cần biến môi trường, sao chép `.env.example` thành `.env.local` và chỉ điền secret ở máy cục bộ. Không commit `.env.local`.

## Cấu trúc

```text
agent/        Quy trình điều phối agent
docs/         Yêu cầu sản phẩm và thiết kế kỹ thuật
tasks/        Roadmap triển khai theo thứ tự
project-log/  Trạng thái thực tế và bộ nhớ dài hạn
```

## Cách bắt đầu

Đưa cho coding agent câu lệnh:

```text
Đọc `agent/MASTER.md` và bắt đầu làm việc tự động theo đúng quy trình. Dự án có thể chưa được khởi tạo môi trường, vì vậy hãy tự xác định trạng thái và bắt đầu từ task sẵn sàng đầu tiên. Chỉ dừng khi gặp điều kiện trong `agent/STOP_CONDITIONS.md`.
```

Agent phải tự đọc `project-log/NEXT_STEPS.md` và thư mục `tasks/` để xác định task hiện tại. Tuy nhiên, sau khi hoàn thành, commit và push task đó lên `origin/dev`, agent phải dừng và chờ người dùng yêu cầu task tiếp theo.


## Chính sách Git mặc định

Sau mỗi task hoặc subtask có thay đổi code và đã kiểm tra, agent sẽ tự động:

```text
commit
→ đồng bộ an toàn với origin/dev
→ push lên origin/dev
```

Agent không được push lên `main`, không được force push và phải dừng khi gặp conflict hoặc thiếu quyền truy cập.


## Chính sách dừng sau push

Mỗi phiên chỉ thực hiện một task hoặc một đơn vị công việc. Sau khi push thành công lên `origin/dev`, agent báo cáo kết quả và dừng. Task tiếp theo chỉ được bắt đầu khi người dùng gửi yêu cầu mới.
