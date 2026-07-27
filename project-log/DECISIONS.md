# Decisions

## D-001 — Task selection

Agent tự xác định task sẵn sàng từ trạng thái và dependency, nhưng mỗi phiên chỉ thực hiện một task hoặc subtask.

## D-002 — Human confirmation boundary

Agent dừng với thay đổi phá hủy dữ liệu, dịch vụ trả phí, secret, production deploy/migration, thay đổi kiến trúc lớn hoặc quyết định product quan trọng.

## D-003 — Initial stack

CoffeeHub ưu tiên Next.js, React, TypeScript, Tailwind CSS, Prisma và PostgreSQL/Neon trong một codebase web/PWA.

## D-004 — AI provider strategy

Provider ưu tiên là OpenAI, sau đó Groq và Gemini. Provider phải thông qua abstraction chung và không được truy cập database trực tiếp.

## D-005 — Git delivery

Sau mỗi task hoặc subtask hoàn chỉnh, agent commit và push lên duy nhất `origin/dev`. Không force push và không push lên `main`.

## D-006 — Session boundary

Sau khi push thành công, agent báo cáo và dừng. Task tiếp theo chỉ bắt đầu khi người dùng gửi yêu cầu mới.

## D-007 — Content-first

Thông tin và danh sách nội dung thường xuyên thay đổi phải chỉnh sửa được qua Admin/CMS. Người dùng không phải sửa code hoặc thao tác database trực tiếp cho hoạt động biên tập thông thường.
