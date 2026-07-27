# CoffeeHub Supabase Markdown Review Report

## 1. Files read

Đã đọc toàn bộ 71 file `.md` thuộc repository trước khi sửa, gồm entry points, agent control, product/technical docs, task canonical/legacy và project-log. Markdown trong `node_modules` không thuộc bộ kit.

## 2. Files modified

Đã sửa các nguồn kiến trúc, sản phẩm/nội dung, flow, deployment, agent rules, task Supabase và project-log. Danh sách chính xác được xác minh bằng `git diff --name-status`.

## 3. Files added

Không thêm Markdown mới; trách nhiệm được giữ trong file chuyên biệt hiện có.

## 4. Files deleted

Đã xóa 16 task legacy trùng số, `CONSOLIDATION_NOTES.md` và `agent/QUALITY_CHECKLIST.md`. Roadmap canonical còn đúng Task 00–21.

## 5. Neon removed

Đã loại Neon khỏi hướng dẫn vận hành, database và deployment. Không còn kiến trúc song song Neon–Supabase.

## 6. Supabase added

Nguồn sự thật mới: Supabase PostgreSQL/Auth/Storage; Next.js/React/TypeScript/Tailwind trên Vercel; Prisma là ORM; AI OpenAI → Groq → Gemini.

## 7. Authentication changes

Email/password trước; SSR session xác minh server; role admin dùng `app_metadata`; routes/mutations kiểm tra Auth và AuthZ. Không NextAuth/Auth.js; OAuth là task riêng.

## 8. Database changes

Repository → Prisma → Supabase PostgreSQL, pooled runtime/direct migration connection, migrations trong Git, transaction và RLS public/owner/admin. Service role không là bypass thông thường.

## 9. Storage changes

Binary ở Supabase Storage; PostgreSQL lưu bucket/path/URL/metadata. Có public/private policy, signed URL/server delivery, upload validation, alt/fallback và orphan cleanup.

## 10. Admin/CMS changes

Admin quản lý profile, projects/media, experience/skills/education, posts, landing/navigation/footer/social/FAQ/SEO/settings, ordering và trạng thái xuất bản; không cần sửa code/database thủ công.

## 11. Environment and deployment changes

Đã chuẩn hóa app URL, Supabase public variables, server-only service role, `DATABASE_URL`, `DIRECT_URL` và AI keys. Vercel + Supabase là nền tảng triển khai; production/billing/nâng gói cần xác nhận.

## 12. Markdown link results

Roadmap canonical có một task cho mỗi số 00–21. Relative Markdown references được kiểm tra sau khi xóa legacy files.

## 13. Remaining conflicts

Không còn xung đột chủ động Neon–Supabase. Repository chưa triển khai Supabase và trạng thái này được ghi rõ.

## 14. User confirmation boundaries

Dừng trước billing/add-on/nâng gói, secrets thật, production migration/deploy, công khai dữ liệu private hoặc thay đổi permission nhạy cảm. Free Plan là ưu tiên, không phải cam kết miễn phí vĩnh viễn.

Documentation consistency check: PASSED
