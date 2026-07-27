# PRD — CoffeeHub

## 1. Tổng quan

CoffeeHub là ứng dụng quản lý và phát triển cá nhân hoạt động trên web và dưới dạng Progressive Web App. Ứng dụng tập trung các dữ liệu liên quan đến công việc, lịch trình, ghi chú, mục tiêu và kế hoạch phát triển vào một hệ thống duy nhất.

Sản phẩm được xây dựng với hai mục tiêu song song:

- Trở thành công cụ sử dụng hằng ngày trên laptop và iPhone.
- Trở thành một dự án portfolio thể hiện năng lực frontend, backend, database, PWA và AI.

## 2. Mục tiêu phiên bản đầu

Sau khi hoàn thành phiên bản đầu, CoffeeHub phải:

- Hoạt động trên Internet với domain và HTTPS.
- Có public landing page và private application.
- Có đăng nhập và bảo vệ dữ liệu cá nhân.
- Hiển thị tốt trên desktop, tablet và mobile.
- Cho phép quản lý Goal, Roadmap, Task, Event, Note và Checklist.
- Tự động lưu các nội dung dài.
- Đồng bộ dữ liệu giữa laptop và iPhone.
- Có khả năng khôi phục draft khi mất mạng.
- Có PWA manifest, icon và trải nghiệm cài đặt.
- Có nền tảng notification và AI để mở rộng.

## 3. Đối tượng sử dụng

### Người dùng cá nhân

- Theo dõi việc cần làm trong ngày.
- Lập mục tiêu dài hạn.
- Chia mục tiêu thành roadmap và task.
- Quản lý lịch học, lịch làm việc và deadline.
- Viết ghi chú có autosave.
- Xem tiến độ tuần.
- Nhờ AI phân tích hoặc đề xuất kế hoạch.

### Người xem portfolio

- Xem giới thiệu sản phẩm.
- Xem ảnh hoặc demo giao diện.
- Xem stack và các quyết định kỹ thuật.
- Không được xem dữ liệu cá nhân trong workspace.

## 4. Phạm vi chức năng

### Website công khai

- Trang chủ.
- Giới thiệu CoffeeHub.
- Vấn đề sản phẩm giải quyết.
- Tính năng chính.
- Demo hoặc screenshot giao diện.
- Trình bày PWA và khả năng đồng bộ.
- Trình bày AI Assistant.
- Công nghệ sử dụng.
- Thông tin dự án và liên kết portfolio.

### Authentication

- Đăng nhập.
- Đăng xuất.
- Session.
- Protected routes.
- Kiểm tra ownership theo `userId`.
- Trang lỗi unauthorized.

### Dashboard

- Lời chào và tóm tắt ngày.
- Task hôm nay.
- Task quá hạn.
- Goal đang hoạt động.
- Tiến độ tuần.
- Event sắp tới.
- AI insight placeholder hoặc AI insight thật ở giai đoạn sau.

### Profile

- Thông tin cơ bản.
- Học vấn.
- Kỹ năng.
- Kinh nghiệm.
- Dự án.
- Quyền công khai từng nhóm dữ liệu.

### Goals

- Danh sách Goal.
- Tạo, xem, sửa và xóa mềm.
- Status.
- Priority.
- Ngày bắt đầu và deadline.
- Tiêu chí thành công.
- Tiến độ.
- Roadmap, Task và Checklist liên quan.
- Lịch sử cập nhật tiến độ.
- Phân tích bằng AI.

### Roadmaps

- Roadmap thuộc Goal.
- Stage hoặc milestone có thứ tự.
- Thời gian dự kiến.
- Trạng thái.
- Tiêu chí hoàn thành.
- Task liên quan.
- AI tạo bản nháp roadmap.

### Tasks

- Danh sách Task.
- Tạo, xem, sửa và xóa mềm.
- Status.
- Priority.
- Deadline.
- Estimated time.
- Goal và Roadmap Stage liên quan.
- Parent Task hoặc Subtask nếu domain được chốt sử dụng.
- List view.
- Board view nếu còn trong phạm vi.
- Optimistic update.

### Calendar và Events

- Xem lịch theo tháng, tuần hoặc agenda tùy thiết kế cuối.
- Tạo event một lần.
- Event lặp lại.
- Liên kết Event với Goal hoặc Task.
- Reminder trước thời điểm diễn ra.

### Notes

- Danh sách ghi chú.
- Trình soạn thảo ghi chú.
- Autosave bằng debounce.
- Local draft.
- Save status.
- Version conflict.
- AI summary ở giai đoạn sau.

### Checklists

- Checklist gắn với Goal, Roadmap hoặc Task.
- Item có trạng thái hoàn thành.
- Trước khi triển khai phải làm rõ khác biệt giữa Checklist và Subtask.

### Notifications

- Reminder một lần.
- Reminder lặp lại.
- Tùy chọn trước 15 phút, 1 giờ và 1 ngày.
- Deep link tới đúng đối tượng.
- Cập nhật notification khi deadline thay đổi.
- Hủy notification khi đối tượng hoàn thành hoặc bị xóa.

### AI Assistant

- Provider abstraction.
- Thứ tự ưu tiên mặc định: OpenAI, Groq, Gemini.
- Phân tích Goal.
- Tạo Goal draft.
- Tạo Roadmap draft.
- Tạo Task draft.
- Daily plan.
- Weekly review.
- Truy vấn dữ liệu CoffeeHub theo context được cho phép.
- Preview và confirm trước khi lưu thay đổi quan trọng.
- Audit log và Undo khi phù hợp.

## 5. Ngoài phạm vi phiên bản đầu

- Native iOS app.
- App Store release.
- React Native.
- Face ID riêng trong ứng dụng.
- iOS Widget.
- Live Activities.
- Collaboration nhiều người dùng.
- Realtime phức tạp nếu refetch đã đáp ứng nhu cầu.
- Thanh toán.
- Marketplace.
- AI tự động xóa dữ liệu.
- AI tự động sửa hàng loạt mà không xác nhận.
- Dịch vụ trả phí chưa được chấp thuận.

## 6. Yêu cầu giao diện

- Dark-first.
- Hiện đại, tập trung và có chiều sâu.
- Màu chủ đạo xanh dương.
- Nền navy kết hợp radial gradient, grid hoặc texture nhẹ.
- Glass-like card có tiết chế.
- Không dùng glow quá mạnh.
- Desktop dùng sidebar.
- Mobile dùng bottom navigation.
- Touch target đủ lớn.
- Có loading, empty, error, offline và save states.

## 7. Yêu cầu backend

- PostgreSQL/Neon là nguồn dữ liệu chính thức.
- Frontend và AI không truy cập database trực tiếp.
- Input phải validate.
- Mọi dữ liệu private phải giới hạn theo `userId`.
- Thao tác nhiều bản ghi dùng transaction.
- Mutation có retry dùng idempotency key.
- Bản ghi autosave quan trọng có version.
- Dữ liệu chính nên hỗ trợ soft delete.

## 8. Yêu cầu autosave và offline

- Toggle hoặc thay đổi trạng thái lưu ngay.
- Nội dung dài autosave sau 800–1200 ms ngừng nhập.
- Không autosave ngay lần render đầu tiên.
- Hiển thị `Saving`, `Saved`, `Failed`, `Offline` và `Syncing`.
- Draft và mutation queue lưu trong IndexedDB.
- Đồng bộ lại khi có mạng.
- Không âm thầm ghi đè phiên bản mới hơn.

## 9. Yêu cầu AI

- AI provider chỉ tạo structured response hoặc proposal.
- Structured output phải được validate trước khi dùng.
- Goal, Roadmap, batch Task, sửa hàng loạt và xóa phải cần xác nhận.
- Note, review hoặc suggestion chỉ auto-save nếu người dùng bật.
- AI action phải có audit log.
- Fallback provider chỉ xảy ra với quota, rate limit, timeout hoặc provider unavailable.
- Không fallback khi lỗi là validation, permission hoặc yêu cầu không hợp lệ.

## 10. Yêu cầu chi phí

- Ưu tiên Vercel, Neon và các gói miễn phí phù hợp.
- Không cài hoặc bật dịch vụ trả phí nếu chưa được xác nhận.
- Thiết kế AI không phụ thuộc một nhà cung cấp.
- ChatGPT Plus không được xem là quyền sử dụng OpenAI API.

## 11. Tiêu chí hoàn thành

- Public và private routes hoạt động.
- Authentication bảo vệ private data.
- Core feature lưu và đọc dữ liệu thật.
- Responsive trên laptop và iPhone.
- Autosave có trạng thái rõ ràng.
- PWA cài được trong môi trường hỗ trợ.
- Không có secret ở client hoặc repository.
- Không có lỗi nghiêm trọng khi chạy lint, typecheck và build.
- Project log và task được cập nhật theo trạng thái thực tế.
