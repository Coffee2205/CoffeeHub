# Issues

## I-002 — Next.js transitive dependency advisories

- Trạng thái: Open; không chặn development hiện tại, cần đánh giá lại trước release.
- `npm audit --omit=dev` ngày 2026-07-27 còn 3 high advisory thuộc `next` qua `postcss` và `sharp`.
- Nhánh Prisma đã được xử lý bằng bản vá đồng bộ `7.9.1` và không còn xuất hiện trong production audit.
- npm chỉ đề xuất hạ Next.js xuống `9.3.3`; đây là thay đổi phá vỡ App Router/React hiện tại nên không áp dụng và không chạy `audit fix --force`.
- Theo dõi bản vá upstream, sau đó nâng cấp trong maintenance task có đầy đủ regression test.
