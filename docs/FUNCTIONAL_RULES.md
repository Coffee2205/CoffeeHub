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
- Chat hoạt động bình thường ngay cả khi người dùng không yêu cầu tạo dữ liệu.
- Goal, Roadmap, Task, Event, Note, Checklist và mọi update luôn cần preview + xác nhận mặc định.
- Xác nhận chỉ áp dụng cho proposal đang hiển thị; sửa proposal phải xác nhận lại.
- Server phải lấy owner từ session, validate đúng schema và dùng Feature Service hiện có; AI không tạo SQL hoặc gọi database trực tiếp.
- Batch Goal/Roadmap/Task dùng transaction và idempotency key.
- Delete, đổi quyền/role, CMS publish, migration và thao tác đặc quyền không được thực hiện bởi chatbot trong phiên bản đầu.
- Auto-save chỉ áp dụng cho action được bật trong Settings.
- Mọi commit AI quan trọng có audit log.
- Undo không được hứa nếu chưa có cơ chế thực tế.

## Provider fallback

- Provider đầu tiên thành công thì dừng.
- Chỉ fallback với lỗi được phép.
- Không gọi đồng thời nhiều provider cho cùng một action commit.
- Không tạo proposal mới nếu provider đầu đã trả output hợp lệ.

## Public CV data

- Public routes được phép hiển thị dữ liệu cá nhân thật khi owner đã chủ động publish.
- Khách không cần account để xem thông tin nghề nghiệp đã publish.
- Draft, hidden, deleted và private workspace data không được public.
- Public repository/query chỉ chọn cột cần thiết và không đọc private domain tables.
- Demo data phải tách khỏi production content.
- Public contact email có thể khác email dùng để đăng nhập.
# Trạng thái nội dung và quyền truy cập

- Public chỉ đọc nội dung `published`; draft/hidden chỉ admin có quyền mới đọc và sửa.
- Nội dung riêng tư luôn scope owner; admin override phải rõ trong policy và audit được.
- Thao tác Admin đi qua server validation, Supabase Auth/AuthZ, service, repository và Prisma; RLS là lớp phòng vệ bổ sung.
- Media public/private phải khớp trạng thái nội dung; không công khai signed URL dài hạn hoặc service role key.
