# Decisions

## D-015 — AI planning resolves existing entities before create

AI planning follows `FIND → MATCH → LINK → EXTEND → CREATE`. Candidate IDs come only from bounded owner-scoped server queries; model output never supplies trusted UUIDs. Ambiguous matches require owner selection, Create New is an explicit override, and every saved/confirmed relationship is reloaded and hierarchy-validated. Planning continues to use the existing Goal/Roadmap/RoadmapStage/Task/Checklist tables and D-014 Checklist semantics; no parallel AI domain tables are allowed.


## D-013 — AI is chat-first with confirmed structured actions

AI Assistant phải hoạt động như chatbot nhiều lượt bình thường. Khi người dùng yêu cầu lên kế hoạch hoặc thay đổi CoffeeHub, model chỉ tạo structured proposal cho Goal/Roadmap/Task/Event/Note/Checklist. Owner xem/sửa và xác nhận proposal hiện tại; server mới re-validate và gọi Feature Service để commit bằng ownership, transaction, idempotency và audit. Model không truy cập database trực tiếp. Delete, role/permission, CMS publish và migration bị cấm trong chatbot v1.

## D-014 — Checklist là domain độc lập

Checklist là danh sách xác minh riêng, không phải Subtask ẩn. Nó không có deadline hoặc priority; progress được tính chỉ từ item của chính nó. Checklist có thể gắn tối đa một ngữ cảnh cha trong Goal, Roadmap hoặc Task để tham chiếu, nhưng không tự cộng vào progress của Goal và không xuất hiện trên Dashboard v1.

## D-012 — Database-backed display identity

Tên xuất hiện trên `https://coffeehub.id.vn/`, public CV và workspace lấy từ Profile do owner cấu hình trong database. Auth email/Gmail chỉ phục vụ đăng nhập và không được dùng hoặc suy ra làm tên hiển thị. Route `/` luôn là public CV, kể cả khi owner đang có session.

## D-011 — AI proposal-only foundation

AI providers only create runtime-validated proposals. They cannot import Prisma/repositories or commit data. Future create/update actions map proposals into existing forms/services and require owner confirmation; destructive/privileged actions are forbidden. AI Foundation uses a network-free Mock Provider and keeps OpenAI/Groq/Gemini as stubs until dedicated integration tasks.

## D-001 — Task selection

Agent tự xác định task sẵn sàng từ trạng thái và dependency, nhưng mỗi phiên chỉ thực hiện một task hoặc subtask.

## D-002 — Human confirmation boundary

Agent dừng với thay đổi phá hủy dữ liệu, dịch vụ trả phí, secret, production deploy/migration, thay đổi kiến trúc lớn hoặc quyết định product quan trọng.

## D-003 — Initial stack

CoffeeHub dùng Next.js, React, TypeScript và Tailwind CSS trên Vercel. Supabase là backend platform chính, gồm Supabase PostgreSQL, Supabase Auth và Supabase Storage. Prisma vẫn là ORM cho truy cập dữ liệu nghiệp vụ. Ưu tiên Supabase Free Plan khi đáp ứng nhu cầu; mọi nâng cấp hoặc tính năng trả phí cần người dùng xác nhận trực tiếp.

## D-004 — AI provider strategy

Provider ưu tiên là OpenAI, sau đó Groq và Gemini. Provider phải thông qua abstraction chung và không được truy cập database trực tiếp.

## D-005 — Git delivery

Sau mỗi task hoặc subtask hoàn chỉnh, agent commit và push lên duy nhất `origin/dev`. Không force push và không push lên `main`.

## D-006 — Session boundary

Sau khi push thành công, agent báo cáo và dừng. Task tiếp theo chỉ bắt đầu khi người dùng gửi yêu cầu mới.

## D-007 — Content-first

Thông tin và danh sách nội dung thường xuyên thay đổi phải chỉnh sửa được qua Admin/CMS. Người dùng không phải sửa code hoặc thao tác database trực tiếp cho hoạt động biên tập thông thường.

## D-008 — Design foundation typography

CoffeeHub dùng Geist Sans cho giao diện và Geist Mono cho dữ liệu kỹ thuật. Font được self-host qua package `geist`; UI primitives nền tảng dùng React và Tailwind/CSS thuần, chưa phụ thuộc component library lớn.

## D-009 — Visible vertical slices

Mỗi task feature phải kết thúc bằng một route có thể mở và một luồng có thể sử dụng. Backend/schema/test không đủ để đánh dấu hoàn thành nếu UI chưa tiêu thụ kết quả. CMS chỉ hoàn tất khi nội dung đã publish xuất hiện trên public page hoặc preview tương ứng.

## D-010 — Public site early

Public website cơ bản phải được hoàn thiện trong Task 07 cùng CMS. Task 17 chỉ polish, SEO, storytelling và performance; không trì hoãn lần đầu nhìn thấy website đến Task 17.

## CV-first public access

- Website public là CV/portfolio chính thức của chủ sở hữu.
- Khách anonymous xem toàn bộ thông tin nghề nghiệp đã `published` mà không cần account.
- Production không có guest login hoặc public signup.
- Owner đăng nhập được chuyển đến `/app/dashboard` và truy cập toàn bộ workspace.
- Owner/admin quản lý CV qua `/admin`.
- Login không phải cơ chế mở khóa thêm thông tin CV; publish status quyết định dữ liệu công khai.

## Epic-based planning

Roadmap dùng Epic → Feature → Task → Subtask. Feature mới được thêm vào Epic phù hợp; task mới được thêm trong Feature mà không đánh lại số toàn dự án.

## Permanent continue prompt

Các phiên sau dùng `agent/CONTINUE.md`. Người dùng không cần viết lại mục tiêu phiên; agent đọc trạng thái và task hiện tại.
