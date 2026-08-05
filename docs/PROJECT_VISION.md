# Mục tiêu và định vị dự án

## Mục tiêu sản phẩm

CoffeeHub là hệ thống quản lý và phát triển cá nhân giúp người dùng tập trung công việc, mục tiêu, kế hoạch và dữ liệu cá nhân vào một nơi duy nhất.

Sản phẩm phải giúp người dùng:

- Quản lý task, lịch, ghi chú, mục tiêu, roadmap và checklist.
- Theo dõi tiến độ theo ngày, tuần và từng mục tiêu.
- Sử dụng cùng một dữ liệu trên laptop và iPhone.
- Tự động lưu thay đổi khi làm việc.
- Tiếp tục làm việc khi mạng không ổn định và đồng bộ lại khi có mạng.
- Nhận hỗ trợ từ AI để phân tích mục tiêu, tạo kế hoạch và chia nhỏ công việc.
- Kiểm soát dữ liệu nào AI được đọc hoặc tạo.
- Duy trì chi phí vận hành thấp, ưu tiên các gói miễn phí.

## Định vị

CoffeeHub không chỉ là một ứng dụng todo list.

Định vị chính:

> Không gian làm việc cá nhân giúp biến mục tiêu thành kế hoạch có thể thực hiện và theo dõi được.

Thông điệp sản phẩm:

> Organize your work. Build your goals. Understand your progress.

## Phạm vi sản phẩm

CoffeeHub gồm hai khu vực:

### Website CV/portfolio công khai

- Là CV online chính thức của chủ sở hữu.
- Hiển thị thông tin cá nhân được chủ sở hữu chủ động publish.
- Hiển thị giới thiệu, kinh nghiệm, kỹ năng, học vấn, dự án, bài viết và liên kết liên hệ.
- Khách xem không cần đăng nhập hoặc sử dụng account khách.
- Không hiển thị dữ liệu workspace riêng tư như Goal, Task, Note, Calendar hoặc AI history.
- Route `/` là CV/portfolio của chủ sở hữu; tên và nội dung lấy từ Profile/CMS trong database, không lấy từ Gmail/auth email.

### Workspace cá nhân của chủ sở hữu

- Chỉ truy cập sau khi owner đăng nhập.
- Đăng nhập thành công tự động vào `/app/dashboard`.
- Owner truy cập toàn bộ Dashboard, Profile, Goals, Roadmaps, Tasks, Calendar, Notes, Checklists, Notifications, Settings và AI Assistant.
- AI Assistant vừa là chatbot nhiều lượt, vừa tạo proposal lập kế hoạch hoặc Event/Note; mọi database write phải được owner xác nhận và đi qua Feature Service.
- Owner có thêm khu vực Admin/CMS để quản lý nội dung CV công khai.
- Dữ liệu được đồng bộ qua backend chung.

## Nhóm người dùng

### Người dùng chính

Giai đoạn đầu, CoffeeHub được tối ưu cho một người dùng cá nhân:

- Làm việc trên laptop.
- Theo dõi nhanh bằng iPhone.
- Quản lý nhiều mục tiêu song song.
- Muốn AI hỗ trợ nhưng không muốn phụ thuộc vào một nhà cung cấp duy nhất.

### Người xem CV/portfolio

Cần thấy mà không đăng nhập:

- Tên, headline, giới thiệu và thông tin liên hệ được publish.
- Kinh nghiệm, kỹ năng và học vấn.
- Dự án và case study.
- Bài viết hoặc nội dung chuyên môn nếu có.
- Giao diện hoàn chỉnh và chuyên nghiệp.
- Không được truy cập dữ liệu workspace riêng tư.

## Nguyên tắc dài hạn

- Một codebase cho web và PWA.
- Mobile-first khi thiết kế tương tác.
- Dark-first, màu xanh dương là màu nhận diện chính.
- Backend là nguồn dữ liệu chính thức.
- AI chỉ thao tác dữ liệu qua service có kiểm soát.
- Không thêm dịch vụ trả phí khi chưa được người dùng xác nhận.
- Không gắn chặt hệ thống với một AI provider.
- ChatGPT Plus không được xem là OpenAI API credit.
- OpenAI được ưu tiên khi API khả dụng; Groq và Gemini là provider dự phòng.

## Thành công của phiên bản đầu

Phiên bản đầu được coi là hoàn thành khi:

- Website công khai đã deploy và có HTTPS.
- Private application có authentication.
- Dashboard, Goals, Roadmaps, Tasks, Calendar và Notes hoạt động.
- Dữ liệu lưu vào PostgreSQL và đồng bộ giữa thiết bị.
- Autosave có trạng thái rõ ràng.
- PWA có thể được cài trên laptop và iPhone.
- Notification hoạt động trong giới hạn kỹ thuật của PWA.
- AI foundation có provider abstraction và structured action.
- AI không thể âm thầm xóa hoặc sửa dữ liệu quan trọng.
- Lint, typecheck và build không có lỗi nghiêm trọng.
# Nền tảng và tính bền vững

CoffeeHub hợp nhất backend trên Supabase (PostgreSQL, Auth, Storage) và triển khai Next.js trên Vercel. Thiết kế ưu tiên gói miễn phí khi đủ nhu cầu nhưng không phụ thuộc lời hứa “miễn phí mãi mãi”: dữ liệu PostgreSQL, migrations trong Git, media inventory/export và ranh giới repository/service phải cho phép backup, recovery và chuyển sang PostgreSQL khác.
