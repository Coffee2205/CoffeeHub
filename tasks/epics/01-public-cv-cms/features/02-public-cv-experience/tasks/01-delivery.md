# Task 01 — Public CV Experience and Polish delivery

## Hierarchy

- Epic: `Public CV and Content Management`
- Feature: `Public CV Experience and Polish`
- Source roadmap item: `tasks/epics/01-public-cv-cms/features/02-public-cv-experience/FEATURE.md`
- Task path: `tasks/epics/01-public-cv-cms/features/02-public-cv-experience/tasks/01-delivery.md`

## Trạng thái

Completed

## Mục tiêu

Hoàn thiện route `/` tại `https://coffeehub.id.vn/` thành CV/portfolio chính thức của owner, đọc dữ liệu đã publish từ database và dùng `docs/PUBLIC_CV_CONTENT_REFERENCE.md` làm nguồn nội dung ban đầu.

## Dependency

- Admin/CMS public content foundation đã hoàn thành.
- Không phụ thuộc PWA/Offline; public CV là ưu tiên độc lập và phải triển khai trước các phần polish PWA.

## Subtasks

- [ ] Audit public query, profile schema và CMS trước khi tạo field/migration mới.
- [ ] Hero dùng `profiles.display_name`, headline, short bio và avatar từ database; tuyệt đối không dùng auth email/Gmail làm tên hoặc fallback.
- [ ] About / professional objective.
- [ ] Skills theo nhóm và thứ tự hiển thị.
- [ ] Work experience timeline.
- [ ] Featured projects và project detail links khi đã publish.
- [ ] Education, certifications và activities.
- [ ] Contact/social/CV CTA với visibility rõ ràng; phone, DOB và gender không public mặc định.
- [ ] Owner đang đăng nhập mở `/` vẫn thấy CV và có CTA Dashboard/Manage CV, không auto-redirect.
- [ ] Audit toàn bộ visible-name fallback ở public/header/dashboard; thay email fallback bằng Profile hoặc fallback trung tính.
- [ ] Empty states bỏ qua section rỗng một cách sạch sẽ, không hiện null/placeholder cá nhân.
- [ ] SEO metadata
- [ ] Privacy/terms links

## Không thực hiện

- Không hiển thị private workspace data, auth email hoặc field chưa publish.
- Không dùng testimonial hoặc số liệu giả
- Không biến `/` thành landing page quảng cáo tính năng CoffeeHub.
- Không hard-code thông tin CV trong component; nội dung thay đổi phải đến từ database/CMS.

## File dự kiến

- `src/app/(public)/* hoặc cấu trúc tương ứng`
- `src/components/marketing/*`

## Ảnh hưởng database

Ưu tiên tái sử dụng Profile, Experience, Skill, Education, Project, SiteLink và CMS section hiện có. Chỉ tạo migration additive nếu audit xác nhận thiếu Certification/Activity/visibility field; mọi model mới cần validation, Admin UI, ordering, status, ownership và public-published RLS.

## Tiêu chí hoàn thành

- `/` hiển thị tên `Tran Nguyen Ngoc Hung` từ database khi profile tương ứng được publish; test xác nhận không có chuỗi auth email trong display-name UI/HTML public.
- Public page responsive và có đầy đủ các section đã có dữ liệu từ CV tham khảo.
- Không truy cập dữ liệu private
- Anonymous không cần login; owner có session vẫn xem được `/`.
- Owner chỉnh display name/nội dung trong Admin, publish và anonymous thấy thay đổi mà không sửa code/SQL.
- Metadata đầy đủ
- Build đạt

## Kết quả thực hiện

### File đã tạo hoặc sửa

- `src/app/page.tsx`, `src/app/loading.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`.
- `src/features/public-site/public-site.repository.ts`, `src/features/public-site/public-shell.tsx`.
- Workspace identity files in `src/app/app`, `src/components/layout` and `src/features/dashboard`.

### Quyết định kỹ thuật

- Tái sử dụng Profile, Experience, Skill, Education, Project, ContentSection, SiteLink và SiteSetting; Certifications/Activities dùng ContentSection đúng semantics.
- Public query luôn lọc `PUBLISHED` và `deletedAt = null`; không dùng auth email làm tên hoặc contact fallback.
- Privacy/Terms là dynamic routes để thay đổi publish trong CMS xuất hiện mà không cần build lại.

### Vấn đề còn lại

- Không có blocker cho Task này. Avatar và social link giữ empty state cho tới khi owner chủ động cung cấp/publish.

### Kiểm tra

- Lint: Đạt (`npm run lint`).
- Typecheck: Đạt (`npm run typecheck`).
- Test: Đạt 51/51 (`npm test`).
- Build: Đạt (`npm run build`).
- Manual test: Đạt anonymous desktop 1440×1000, anonymous mobile 390×844, owner `/`, project detail, Privacy và Terms; không có browser error.
- Database: nội dung CV tham chiếu được tạo/publish qua Admin UI; không chạy SQL write hoặc migration.
