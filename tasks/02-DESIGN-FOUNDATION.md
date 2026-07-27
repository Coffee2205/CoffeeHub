# Task 02 — Design foundation

## Trạng thái

Completed

## Mục tiêu

Thiết lập design tokens và component nền tảng theo concept dark-blue.

## Dependency

- `01-REPOSITORY-AUDIT.md` phải hoàn thành.

## Công việc

- [x] Xác nhận font và typography.
- [x] Tạo color, spacing, radius, border và shadow tokens.
- [x] Tạo background navy, radial gradient và grid nhẹ.
- [x] Tạo Button, Input, Textarea, Badge, Card và SaveStatus nền tảng.
- [x] Tạo loading, empty và error primitives.
- [x] Kiểm tra contrast và reduced motion.

## Không thực hiện

- Không xây Dashboard hoàn chỉnh.
- Không cài component library lớn nếu chưa được chấp thuận.
- Không đổi concept sang light-first.

## File dự kiến

- `src/app/globals.css`
- `src/components/ui/*`
- `src/lib/* nếu cần`
- `project-log/*`

## Ảnh hưởng database

Không có.

## Tiêu chí hoàn thành

- Tokens được dùng thực tế trong component.
- Component hiển thị đúng trên mobile và desktop.
- Không có horizontal overflow.
- Lint, typecheck và build đạt.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Cập nhật `src/app/layout.tsx`, `globals.css` và trang preview `/`.
- Tạo `src/lib/cn.ts`.
- Tạo Button, Input, Textarea, Badge, Card, SaveStatus và data state primitives trong `src/components/ui`.
- Thêm dependency font self-hosted `geist` và cập nhật npm lockfile.

### Quyết định kỹ thuật

- Geist Sans dùng cho UI; Geist Mono dùng cho metrics/dữ liệu kỹ thuật.
- Component nền tảng dùng React + Tailwind/CSS thuần, không cài component library lớn.
- Token primary trang trí giữ màu blue-500; control primary dùng blue-600/700 để text trắng đạt WCAG AA.
- Tất cả component hiện là Server Component tương thích; interaction state sẽ được thêm ở task feature khi cần.

### Vấn đề còn lại

- Không có blocker. Next.js dependency advisories và artifact task legacy vẫn được theo dõi trong `project-log/ISSUES.md`.

### Kiểm tra

- Lint: `npm run lint` thành công.
- Typecheck: `npm run typecheck` thành công.
- Build: `npm run build` thành công.
- Manual test: agent-browser đạt ở 1264px và 390×844; không error overlay, không horizontal overflow, controls/labels được nhận diện.
- Contrast: primary control 4.94:1; hover 6.41:1; secondary text 13.25:1; muted text 7.67:1 trên background chính.
- Reduced motion: global media query tắt animation/transition đáng kể; loading spinner có fallback motion-reduce.
- Commit: `bfdf5e1` (`feat(design): add CoffeeHub UI foundation`).
- Push: Chuẩn bị push lên `origin/dev` trong phiên Task 02.
