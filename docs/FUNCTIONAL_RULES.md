# Quy tắc chức năng — CoffeeHub

## Quy tắc chung

- Mọi dữ liệu private thuộc về một user.
- Không có thao tác dữ liệu quan trọng mà không có phản hồi thành công hoặc thất bại.
- Không ghi chức năng là hoàn thành nếu mới có giao diện mock.
- Không lưu trùng khi request được retry.

## Goal

- Goal phải có title.
- Status và priority dùng enum hoặc giá trị kiểm soát.
- Deadline không được âm thầm thay đổi bởi AI.
- Progress phải có nguồn tính toán rõ ràng.
- Xóa Goal không được làm mất dữ liệu liên quan ngoài ý muốn.
- Nếu cascade, phải được ghi rõ và xác nhận.

## Roadmap

- Roadmap thuộc một Goal hoặc có quy tắc độc lập được tài liệu hóa.
- Stage có thứ tự duy nhất trong phạm vi Roadmap.
- Reorder phải lưu ổn định.
- Xóa stage có Task liên quan cần cảnh báo hoặc strategy rõ ràng.

## Task

- Toggle hoàn thành dùng optimistic update nhưng phải rollback khi lỗi.
- Task quá hạn chỉ khi deadline đã qua và status chưa hoàn thành.
- Task đã xóa mềm không xuất hiện trong query mặc định.
- Task relation phải cùng user ownership.

## Note

- Autosave không chạy ngay khi load dữ liệu.
- Không gửi request sau mỗi ký tự.
- Local draft phải gắn đúng note và user context.
- Version conflict không được tự động ghi đè.

## Calendar và Event

- Event start phải trước end.
- Recurrence phải validate.
- Time zone phải được xác định rõ.
- Reminder phải cập nhật khi event thay đổi.

## Checklist và Subtask

Trước khi triển khai phải chốt:

- Checklist là danh sách xác minh độc lập hay là task nhỏ.
- Có deadline hoặc priority không.
- Có xuất hiện trên Dashboard không.
- Có ảnh hưởng progress Goal không.

Không triển khai hai khái niệm giống nhau chỉ khác tên.

## Notification

- Notification không phải nguồn dữ liệu chính.
- Reminder record hoặc schedule phải có liên kết tới entity gốc.
- Khi entity bị hoàn thành hoặc xóa, notification liên quan phải được cập nhật.
- Nhấn notification mở đúng route.

## AI Action

- Analysis không tự động thay đổi dữ liệu.
- Proposal chưa phải dữ liệu đã lưu.
- Goal, Roadmap, batch Task và delete luôn cần xác nhận mặc định.
- Auto-save chỉ áp dụng cho action được bật trong Settings.
- Mọi commit AI quan trọng có audit log.
- Undo không được hứa nếu chưa có cơ chế thực tế.

## Provider fallback

- Provider đầu tiên thành công thì dừng.
- Chỉ fallback với lỗi được phép.
- Không gọi đồng thời nhiều provider cho cùng một action commit.
- Không tạo proposal mới nếu provider đầu đã trả output hợp lệ.

## Public data

- Không dùng dữ liệu cá nhân thật trên public routes.
- Demo data phải được đánh dấu hoặc tách khỏi production user data.
- Public portfolio không được truy cập database private nếu không cần.
