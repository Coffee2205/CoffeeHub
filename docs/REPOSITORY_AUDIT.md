# Repository Audit — CoffeeHub

## Phạm vi và thời điểm

- Ngày audit: 2026-07-27.
- Branch: `dev`, tracking `origin/dev`.
- Phạm vi: source, cấu hình, dependency, route, database/auth/PWA artifacts, tài liệu agent và task tracker.
- Không cài package, không sửa source, không chạy migration và không kết nối dịch vụ ngoài.

## Kết luận

Repository là một Next.js App Router bootstrap tối thiểu, build được nhưng chưa có feature sản phẩm, persistence, authentication hoặc PWA. Source hiện tại phù hợp để tiếp tục Task 02 Design Foundation. Trước khi phát triển sâu, roadmap canonical phải tiếp tục lấy từ `tasks/README.md`; các task cũ trùng số chỉ là ứng viên legacy và chưa bị xóa trong phiên audit.

## Đã xác minh

### Runtime và dependency

| Thành phần | Phiên bản/trạng thái | Nguồn xác minh |
|---|---|---|
| Node.js | `v24.11.1`; package yêu cầu `>=20.9.0` | runtime và `package.json` |
| Package manager | npm `11.6.2` | runtime và `package-lock.json` |
| Next.js | `16.2.12` | package manifest, lockfile, build output |
| React / React DOM | `19.2.8` | package manifest và package tree |
| TypeScript | `6.0.3`, `strict: true` | package tree và `tsconfig.json` |
| Tailwind CSS | `4.3.3` | package tree, PostCSS config và CSS import |
| ESLint | `9.39.5`, Next core-web-vitals + TypeScript config | package tree và `eslint.config.mjs` |
| Prisma | Chưa cài | package tree và filesystem |
| Authentication | Chưa cài/chưa triển khai | package tree và source search |
| PWA library/service worker | Chưa cài/chưa triển khai | package tree và filesystem |

`next.config.ts` khai báo rõ Turbopack root là working directory. TypeScript dùng module resolution `bundler`, alias `@/*` và không emit output khi typecheck.

### Scripts

| Script | Lệnh | Kết quả audit |
|---|---|---|
| `dev` | `next dev` | HTTP 200 tại `/` |
| `build` | `next build` | Đạt |
| `start` | `next start` | Có cấu hình, không cần chạy cho audit |
| `lint` | `eslint .` | Đạt |
| `typecheck` | `tsc --noEmit` | Đạt |
| `test` | Không tồn tại | Chưa có test runner hoặc test suite |

### Router, route và runtime

- Dùng App Router trong `src/app`; không có Pages Router.
- Route duy nhất do source định nghĩa là `/` qua `src/app/page.tsx`.
- Root layout nằm ở `src/app/layout.tsx`; metadata tĩnh có title và description.
- `/` là static route theo output build.
- Page và layout đều là Server Components mặc định; không có `"use client"` trong source.
- Không có Route Handler, Server Action, dynamic segment, loading boundary, error boundary hoặc custom not-found.
- Không có khai báo Edge runtime. Route hiện tại dùng runtime/build behavior mặc định của Next.js.
- Không có `proxy.ts` hoặc `middleware.ts`.

### Feature hiện có

- Trang bootstrap dark/blue tối thiểu với tên CoffeeHub và thông báo nền tảng sẵn sàng.
- Global CSS và Tailwind CSS hoạt động.
- Metadata cơ bản cho root layout.
- Chưa có dashboard, profile, goals, roadmaps, tasks, calendar, notes, checklist, notifications, admin/CMS, landing page hoàn chỉnh hoặc AI.

### Database và dữ liệu

- Không có `prisma/`, `schema.prisma`, migration hoặc seed.
- Không có database client, repository, service hoặc data query.
- `.env.example` không chứa secret và hiện chưa yêu cầu biến môi trường.
- Không có database change trong audit.

### Authentication, authorization và ownership

- Không có auth provider, session handling, private route hoặc admin route.
- Không có private data hay mutation để kiểm tra ownership.
- Vì chưa triển khai auth/data, repository hiện không đáp ứng các luồng private trong PRD; đây là scope của các task sau, không phải regression của bootstrap.

### Dependency health

- `npm ls --depth=0` xác nhận các dependency chính; npm đồng thời hiển thị một optional package `@emnapi/wasi-threads@1.2.3` là extraneous trong local `node_modules`.
- `npm audit --omit=dev` báo 3 high advisory qua dependency bắc cầu `postcss` và `sharp` của Next.js.
- npm chỉ đề xuất `audit fix --force` dẫn tới downgrade Next.js 9.3.3; không áp dụng vì là thay đổi phá vỡ và ngoài phạm vi audit.

## Suy luận và định hướng chưa triển khai

Các mục sau đến từ tài liệu thiết kế, chưa phải trạng thái code:

- PostgreSQL/Neon, Prisma, data ownership và migration workflow.
- Authentication và admin authorization.
- Service/repository layers và runtime validation.
- PWA, offline queue, autosave conflict handling và idempotency.
- AI provider abstraction OpenAI → Groq → Gemini.
- Vercel deployment và môi trường Development/Preview/Production.

Không được báo cáo các mục này là đã có cho đến khi task tương ứng hoàn thành.

## Phân loại artifact

### Giữ lại

- Toàn bộ cấu hình bootstrap: `package.json`, lockfile, TypeScript, Next.js, ESLint, PostCSS, `.gitignore`, `.env.example`.
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` làm nền cho Design Foundation.
- `MANIFEST.md`, agent controller, docs, project-log và các task canonical được liệt kê trong `tasks/README.md`.

### Cần sửa hoặc bổ sung ở task sau

- Task 02: design tokens, typography, responsive foundation và accessibility baseline.
- Task 03: app shell, route groups và loading/error/not-found states phù hợp.
- Task 04–05: database foundation trước authentication theo roadmap canonical.
- Thêm test strategy/script khi bắt đầu có logic hoặc component cần regression coverage.
- Theo dõi bản Next.js stable có dependency đã vá; không dùng `audit fix --force` hiện tại.
- Sửa project-log sau mỗi push để kết quả không còn ghi “chuẩn bị push”.

### Có thể xóa sau khi xác nhận phạm vi cleanup

Các file dưới đây không nằm trong roadmap canonical và trùng với task đã đánh số lại:

```text
tasks/04-AUTHENTICATION.md
tasks/05-DATABASE-FOUNDATION.md
tasks/07-PROFILE.md
tasks/08-GOALS.md
tasks/09-ROADMAPS.md
tasks/10-TASKS.md
tasks/11-CALENDAR.md
tasks/12-NOTES-AUTOSAVE.md
tasks/13-CHECKLISTS.md
tasks/14-NOTIFICATIONS.md
tasks/15-PWA-OFFLINE.md
tasks/16-PUBLIC-LANDING.md
tasks/17-AI-FOUNDATION.md
tasks/18-AI-GOAL-ASSISTANT.md
tasks/19-AI-PERSONAL-ASSISTANT.md
tasks/20-QA-DEPLOY.md
```

`CONSOLIDATION_NOTES.md` và `agent/QUALITY_CHECKLIST.md` cũng được `REVIEW_REPORT.md` mô tả là đã xóa nhưng vẫn đang được Git track. Không xóa artifact nào trong phiên này vì Task 01 cấm xóa code/file cũ và báo cáo review mâu thuẫn với filesystem.

## Validation thực tế

- `npm run lint`: đạt.
- `npm run typecheck`: đạt.
- `npm run build`: đạt; `/` được prerender static.
- Manual dev smoke-test: HTTP 200, có title/nội dung CoffeeHub; server đã dừng sạch.
- `npm audit --omit=dev`: không đạt do 3 high advisory production-transitive đã mô tả ở trên.

## Task đề xuất tiếp theo

`tasks/02-DESIGN-FOUNDATION.md` là task pending đầu tiên có dependency hoàn thành. Việc cleanup artifact legacy nên được thực hiện trong một task/subtask riêng có phạm vi xóa rõ ràng; không chặn Design Foundation vì roadmap canonical đã xác định được.
