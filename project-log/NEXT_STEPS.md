# Next Steps

## Completed out-of-sequence request — AI planning entity linking

The direct 2026-08-10 user request for relationship-aware AI planning is implemented without changing the active Quality and Release hierarchy. After this delivery, resume the existing QA/Auth blockers below; do not open another AI task automatically.


## AI/mobile/Notes verification blocker

Provide authorized server-only provider keys/models and a working owner E2E credential. Then verify a low-quota OpenAI chat/proposal, controlled fallback, mobile proposal confirmation and Note cancel/confirm/refresh in browser. Do not deploy production from this task.

## Active Epic

`tasks/epics/04-quality-release/EPIC.md`

## Active Feature

`tasks/epics/04-quality-release/features/01-qa-deploy/FEATURE.md`

## Current Task

`tasks/epics/04-quality-release/features/01-qa-deploy/tasks/01-delivery.md` — `In Progress`

## Required next work

1. Dùng Supabase Dashboard hoặc Management API có quyền trên project hiện tại để tắt public signup (`disable_signup=true`) theo D-012.
2. Bật leaked-password protection nếu gói hiện tại hỗ trợ; không nâng gói, bật trial hoặc billing nếu chưa có xác nhận.
3. Cung cấp/xác nhận credential owner và admin dành cho E2E, rồi kiểm tra login, logout, persistence, refresh, expiry, protected mutation và role metadata.
4. Chạy lại Auth/settings audit. Chỉ khi các bước trên đạt mới tick các acceptance criteria còn lại và đánh dấu Task/Feature/Epic Completed.

## Session instruction

Tiếp tục đúng Task này; không mở Task mới.
