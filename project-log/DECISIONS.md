# Decisions

## D-001 — Autonomous workflow

Agent tự đọc trạng thái, chọn task sẵn sàng tiếp theo và tiếp tục mà không yêu cầu người dùng viết lại nhiệm vụ từng phiên.

## D-002 — Human confirmation boundary

Agent phải dừng với thay đổi phá hủy dữ liệu, dịch vụ trả phí, secret, production deploy/migration, thay đổi kiến trúc lớn hoặc quyết định product quan trọng.

## D-003 — Initial product stack

CoffeeHub ưu tiên Next.js, React, TypeScript, Tailwind CSS, Prisma và PostgreSQL/Neon trong một codebase web/PWA.

## D-004 — AI provider strategy

Provider ưu tiên là OpenAI, sau đó Groq và Gemini. Provider phải thông qua abstraction chung và không được truy cập database trực tiếp.


## D-005 — Stop after push

Sau khi hoàn thành một task, commit và push thành công lên `origin/dev`, agent phải dừng phiên. Agent không được tự bắt đầu task kế tiếp cho đến khi người dùng yêu cầu.
