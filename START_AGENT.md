# Khởi động coding agent

Sao chép nguyên văn lệnh sau cho Codex, GPT, Gemini hoặc coding agent:

```text
Đọc `agent/MASTER.md` và bắt đầu làm việc tự động theo đúng quy trình. Dự án có thể chưa được khởi tạo môi trường, vì vậy hãy tự xác định trạng thái và bắt đầu từ task sẵn sàng đầu tiên. Thực hiện đúng một task sẵn sàng, tự cập nhật project-log, commit và push task đó lên `origin/dev`. Sau khi push thành công, báo cáo kết quả và dừng hoàn toàn. Chỉ bắt đầu task tiếp theo khi tôi gửi yêu cầu mới. Vẫn phải dừng sớm nếu gặp điều kiện trong `agent/STOP_CONDITIONS.md`.
```
