# Access Model Review

## Yêu cầu mới

CoffeeHub là CV/portfolio công khai và workspace cá nhân của chủ sở hữu.

## Mô hình đã chốt

```text
Anonymous
→ xem published CV
→ không cần account

Owner
→ login
→ /app/dashboard
→ toàn bộ workspace
→ /admin CMS
```

## Loại bỏ

- Guest account.
- Public signup trong production.
- Quan niệm rằng public routes không được hiển thị dữ liệu cá nhân thật.
- Login để mở khóa thêm thông tin portfolio.

## Ranh giới dữ liệu

### Public khi owner publish

Profile, avatar, bio, contact, experience, skills, education, projects, posts, CV và social links.

### Private

Goals, Roadmaps, Tasks, Calendar, Notes, Checklists, Notifications, Settings, AI history, auth data và drafts.

## File đã cập nhật

- `docs/AUTHENTICATION.md`
- `docs/SITE_MAP.md`
- `docs/USER_FLOWS.md`
- `docs/PROJECT_VISION.md`
- `docs/PRD.md`
- `docs/CONTENT_REQUIREMENTS.md`
- `docs/FUNCTIONAL_RULES.md`
- `docs/ARCHITECTURE_RULES.md`
- `docs/TECHNICAL_DESIGN.md`
- `docs/DEVELOPMENT_ACCOUNTS.md`
- `agent/RULES.md`
- `project-log/DECISIONS.md`
- `project-log/AI_MEMORY.md`
- `project-log/CURRENT_STATUS.md`
- `project-log/NEXT_STEPS.md`

## Implementation impact

Hoàn thành ngày 2026-08-02: public signup đã bị loại khỏi code và khóa trong Supabase Auth; owner redirect chỉ chấp nhận cây `/app` hoặc `/admin`; published CV được anonymous đọc qua các public repository có lọc `PUBLISHED` và `deletedAt: null`. Unit, lint, typecheck, production build và browser smoke-test desktop/mobile đều đạt.
