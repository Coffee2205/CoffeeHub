# PRD — CoffeeHub

## 1. Tổng quan

CoffeeHub là ứng dụng quản lý và phát triển cá nhân hoạt động trên web và dưới dạng Progressive Web App. Ứng dụng tập trung các dữ liệu liên quan đến công việc, lịch trình, ghi chú, mục tiêu và kế hoạch phát triển vào một hệ thống duy nhất.

Sản phẩm được xây dựng với hai mục tiêu song song:

- Trở thành công cụ sử dụng hằng ngày trên laptop và iPhone.
- Trở thành một dự án portfolio thể hiện năng lực frontend, backend, database, PWA và AI.

## 2. Mục tiêu phiên bản đầu

Sau khi hoàn thành phiên bản đầu, CoffeeHub phải:

- Hoạt động trên Internet với domain và HTTPS.
- Có website CV/portfolio công khai và workspace owner được bảo vệ.
- Có đăng nhập và bảo vệ dữ liệu cá nhân.
- Hiển thị tốt trên desktop, tablet và mobile.
- Cho phép quản lý Goal, Roadmap, Task, Event, Note và Checklist.
- Tự động lưu các nội dung dài.
- Đồng bộ dữ liệu giữa laptop và iPhone.
- Có khả năng khôi phục draft khi mất mạng.
- Có PWA manifest, icon và trải nghiệm cài đặt.
- Có nền tảng notification và AI để mở rộng.

## 2.1. Nguyên tắc phát hành tăng dần

CoffeeHub phải luôn có một phiên bản có thể mở và sử dụng trong quá trình phát triển, không chờ đến gần cuối roadmap mới thấy giao diện sản phẩm.

Sau mỗi task feature:

- có ít nhất một route thể hiện thành quả;
- luồng chính hoạt động end-to-end;
- dữ liệu được đọc/ghi qua hệ thống thật hoặc fixture development được ghi nhãn;
- có loading, empty và error state;
- được kiểm tra desktop/mobile;
- báo cáo nêu rõ URL và cách dùng.

Public website phải xuất hiện sớm. CMS không được xem là hoàn tất chỉ vì đã có schema và form quản trị; nội dung đã publish phải được render tại public page hoặc preview page trong cùng task.

## 3. Đối tượng sử dụng

### Người dùng cá nhân

- Theo dõi việc cần làm trong ngày.
- Lập mục tiêu dài hạn.
- Chia mục tiêu thành roadmap và task.
- Quản lý lịch học, lịch làm việc và deadline.
- Viết ghi chú có autosave.
- Xem tiến độ tuần.
- Nhờ AI phân tích hoặc đề xuất kế hoạch.

### Nhà tuyển dụng, đồng nghiệp và người xem CV

- Xem thông tin cá nhân mà chủ sở hữu đã publish.
- Xem kinh nghiệm, kỹ năng, học vấn và dự án.
- Xem GitHub, live demo, CV và cách liên hệ.
- Không cần account hoặc đăng nhập.
- Không được xem Goal, Task, Note, Calendar, settings, AI history hoặc dữ liệu workspace riêng tư.

## 4. Phạm vi chức năng

### Website CV/portfolio công khai

- Trang chủ CV tổng hợp.
- Hồ sơ, headline, bio, avatar và thông tin liên hệ đã publish.
- Kinh nghiệm.
- Kỹ năng.
- Học vấn.
- Danh sách và chi tiết dự án.
- Bài viết nếu có.
- GitHub, LinkedIn, live URL và CV/resume.
- Nội dung chỉ xuất hiện khi đã publish.
- Không yêu cầu guest account hoặc đăng nhập để xem.

### Authentication và access control

- Chỉ owner đăng nhập vào workspace.
- Không public registration và không có guest account trong production.
- Đăng nhập thành công chuyển đến `/app/dashboard`.
- Owner truy cập toàn bộ app routes.
- Owner/admin truy cập CMS routes.
- Session và protected routes.
- Kiểm tra ownership theo `userId`.
- Trang lỗi unauthorized.
- Anonymous luôn xem được public CV đã publish.

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

## 4.1. Access model

| Persona | Public CV | Workspace | Admin/CMS |
|---|---:|---:|---:|
| Khách anonymous | Có | Không | Không |
| Owner đã đăng nhập | Có hoặc redirect vào app | Có toàn bộ | Có |
| Account test không phải admin | Có | Chỉ dùng test nếu cần | Không |

- Public CV là trang thật, không phải demo bị khóa sau login.
- Guest account không tồn tại trong production UX.
- Dữ liệu CV và dữ liệu workspace phải tách bằng publish status, ownership và RLS/authorization.
- Đăng nhập không phải điều kiện để xem thêm thông tin nghề nghiệp đã publish.

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

- Supabase PostgreSQL là nguồn dữ liệu chính thức; Prisma là lớp truy cập dữ liệu nghiệp vụ.
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

- Triển khai Next.js trên Vercel và backend trên Supabase; ưu tiên Supabase Free Plan khi đủ nhu cầu, nhưng phải xác minh giới hạn hiện hành và không được cam kết “miễn phí mãi mãi”.
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
