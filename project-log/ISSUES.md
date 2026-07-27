# Issues

## I-002 — Dependency advisories

- Trạng thái: Open, không chặn bootstrap hoặc Task 03.
- `npm audit --omit=dev` ngày 2026-07-27 báo 7 advisory production/transitive: 1 moderate và 6 high.
- Nhánh Next.js liên quan `postcss`/`sharp`; nhánh Prisma tooling liên quan `find-my-way`/`valibot`.
- npm chỉ đề xuất `audit fix --force` với thay đổi phiên bản phá vỡ; không tự áp dụng.
- Cần theo dõi bản vá upstream và nâng cấp có kiểm thử trong maintenance task riêng.
