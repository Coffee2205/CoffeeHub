# Dashboard definitions

Dashboard là Server Component đọc dữ liệu qua repository → Prisma → Supabase PostgreSQL. User ID luôn lấy từ verified Supabase claim; mọi query có `userId` và bỏ record có `deletedAt`.

## Time boundary

Task 06 dùng UTC vì Profile chưa có timezone preference. UI ghi rõ UTC để không diễn giải sai. Khi Task Profile bổ sung timezone, các boundary ngày/tuần có thể chuyển sang timezone của user mà không đổi repository contract.

- Hôm nay: `[00:00, 00:00 ngày kế tiếp)` UTC.
- Tuần hiện tại: thứ Hai 00:00 đến thứ Hai kế tiếp 00:00 UTC.
- Event sắp tới: `[now, now + 7 ngày)`.

## Metrics

- **Task hôm nay**: Task chưa xóa, status `TODO`, `IN_PROGRESS` hoặc `BLOCKED`, có `dueAt` trong hôm nay.
- **Task quá hạn**: Task cùng tập status chưa hoàn tất, có `dueAt < now`. Task quá hạn trong chính hôm nay có thể xuất hiện ở cả hai nhóm vì hai metric trả lời hai câu hỏi khác nhau.
- **Goal active**: Goal chưa xóa có status `ACTIVE`.
- **Event 7 ngày**: Event chưa xóa bắt đầu trong 7 ngày tiếp theo.
- **Tiến độ tuần**: số Task `COMPLETED` chia tổng Task chưa xóa, không `CANCELLED`, có hạn trong tuần hiện tại. Khi không có Task được lên lịch, kết quả là `0/0` và `0%`.
- **Tiến độ Goal**: số Task `COMPLETED` chia tổng Task chưa xóa, không `CANCELLED`, thuộc Goal đó.

Metric dùng query `count` riêng nên không bị giới hạn bởi danh sách preview. Danh sách Task/Event chỉ lấy 5 record gần nhất; Goal lấy 4 record để giữ Dashboard gọn và giới hạn query.

## States

- `loading.tsx` cung cấp skeleton và trạng thái tổng hợp dữ liệu.
- Mỗi panel có empty state theo đúng loại dữ liệu.
- Error khi đọc database đi tới error boundary của `/app`, không hiển thị raw database error.
- Không có số liệu mẫu hoặc AI insight giả.
