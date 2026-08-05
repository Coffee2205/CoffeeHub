# Prompt tiếp tục dự án CoffeeHub

Sao chép nguyên khối dưới đây cho coding agent đang có quyền truy cập repository CoffeeHub:

```text
Tiếp tục dự án CoffeeHub theo bộ tài liệu hiện tại.

1. Đọc đầy đủ `MANIFEST.md`, `agent/MASTER.md`, `agent/CONTINUE.md`, toàn bộ `project-log/` và task canonical được `project-log/NEXT_STEPS.md` chỉ định.
2. Đọc các tài liệu bắt buộc cho yêu cầu mới:
   - `docs/PUBLIC_CV_CONTENT_REFERENCE.md`
   - `docs/PRD.md`
   - `docs/CONTENT_REQUIREMENTS.md`
   - `docs/AUTHENTICATION.md`
   - `docs/SITE_MAP.md`
   - `docs/USER_FLOWS.md`
   - `docs/AI_ARCHITECTURE.md`
   - `docs/AI_ACTIONS.md`
   - `docs/AI_CONTEXT.md`
   - `docs/AI_SECURITY.md`
   - `docs/TECHNICAL_DESIGN.md`
3. Audit repository, schema Prisma/migrations, Supabase policies và code hiện tại trước khi sửa. Tái sử dụng model/service/field hiện có; không tạo cấu trúc trùng.
4. Thực hiện đúng một Task/Subtask theo ưu tiên trong `NEXT_STEPS.md`. Yêu cầu sản phẩm bắt buộc:
   - `https://coffeehub.id.vn/` và route `/` phải là CV/portfolio thật của tôi, xem được anonymous, không phải landing page quảng cáo CoffeeHub.
   - Tên hiển thị phải lấy từ Profile trong database và chỉnh được qua Admin/CMS. Nội dung tham chiếu ban đầu là `Tran Nguyen Ngoc Hung`; không dùng hoặc suy ra tên từ Gmail/auth email.
   - Dùng CV tham chiếu để hỗ trợ các section About/Objective, Skills, Work Experience, Projects, Education, Certifications, Activities và Contact. Mọi nội dung phải đến từ database, có publish/visibility phù hợp và chỉnh được qua UI; không hard-code trong component.
   - Owner đang đăng nhập mở `/` vẫn thấy CV; chỉ bổ sung CTA Dashboard/Manage CV, không tự redirect.
   - AI Assistant phải chat nhiều lượt như chatbot bình thường. Khi người dùng yêu cầu lên kế hoạch, AI tạo structured proposal cho Goal/Roadmap/Stage/Task/Checklist và có thể đề xuất Event/Calendar hoặc Note.
   - AI/model không được truy cập database, Prisma hoặc SQL trực tiếp. Mọi create/update phải có editable preview và xác nhận rõ ràng cho proposal hiện tại; server sau đó re-validate schema, lấy owner từ session, kiểm tra ownership/relation và gọi Feature Service hiện có bằng transaction/idempotency/audit.
   - Chatbot v1 không được delete dữ liệu, đổi role/quyền, publish CMS, chạy migration theo lời model hoặc thực hiện thao tác đặc quyền.
5. Mỗi feature phải có kết quả mở và sử dụng được, loading/empty/error/success state, dữ liệu thật hoặc empty state đúng, browser verification desktop và mobile. Không đánh dấu Completed nếu mới có schema/mock/test mà UI chưa dùng được.
6. Không tự chạy production migration/deploy, không bật dịch vụ trả phí và không đưa secret vào code/log. Nếu cần credential hoặc quyết định có rủi ro, ghi blocker và dừng theo `agent/STOP_CONDITIONS.md`.
7. Sau khi hoàn thành đúng một Task/Subtask: chạy validation phù hợp, cập nhật task/Feature/project-log, kiểm tra diff, commit tập trung, pull --rebase `origin/dev` khi an toàn, push duy nhất `origin/dev`, báo cáo URL/cách dùng/database changes/test/commit/push và dừng hoàn toàn. Không tự bắt đầu task tiếp theo.
```

Sau phiên đầu, nếu agent đã đọc bộ tài liệu mới và project-log đã cập nhật, các phiên sau có thể dùng prompt ngắn:

```text
Đọc `agent/CONTINUE.md` và tiếp tục đúng task hiện tại. Tuân thủ các quyết định D-012/D-013 và `docs/PUBLIC_CV_CONTENT_REFERENCE.md`; hoàn thành một Task/Subtask, kiểm tra, commit, push `origin/dev`, báo cáo và dừng.
```
