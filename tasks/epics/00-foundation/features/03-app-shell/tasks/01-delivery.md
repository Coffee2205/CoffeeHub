# Task 01 — App Shell delivery

## Hierarchy

- Epic: `Foundation`
- Feature: `App Shell`
- Source roadmap item: `tasks/epics/00-foundation/features/03-app-shell/FEATURE.md`
- Task path: `tasks/epics/00-foundation/features/03-app-shell/tasks/01-delivery.md`

## Trạng thái

Completed

## Mục tiêu

Tạo bộ khung điều hướng cho private application trên desktop và mobile.

## Dependency

- `tasks/epics/00-foundation/features/02-design-foundation/FEATURE.md` phải hoàn thành.

## Subtasks

- [x] Tạo desktop sidebar.
- [x] Tạo desktop header.
- [x] Tạo mobile header.
- [x] Tạo mobile bottom navigation.
- [x] Tạo main content layout.
- [x] Tạo active navigation state.
- [x] Tạo user menu placeholder hoặc kết nối auth nếu đã có.
- [x] Kiểm tra responsive.

## Không thực hiện

- Không triển khai nội dung đầy đủ của Dashboard.
- Không giả lập auth bằng dữ liệu không rõ nguồn.
- Không thêm route ngoài sitemap.

## File dự kiến

- `src/app/app/layout.tsx hoặc route group tương ứng`
- `src/components/layout/*`
- `src/components/navigation/*`
- `project-log/*`

## Ảnh hưởng database

Không có.

## Tiêu chí hoàn thành

- Private shell hiển thị đúng.
- Sidebar không che nội dung.
- Bottom navigation dùng được trên iPhone width.
- Keyboard focus hoạt động.
- Lint, typecheck và build đạt.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Thêm workspace layout tại `src/app/app`, route redirect `/app`, placeholder `/app/dashboard` và loading/error/not-found states.
- Thêm desktop sidebar/header, mobile bottom navigation, navigation config, icon và active link components.

### Quyết định kỹ thuật

- Layout là Server Component; chỉ `NavLink` và error boundary là Client Components vì cần pathname hoặc interaction.
- Navigation dùng đúng route trong sitemap. Các route feature chưa được tạo trong task này.
- User menu là disabled placeholder có accessible label; không giả lập danh tính hoặc session trước Task 05.
- Shell chưa bảo vệ Auth vì Task 05 chịu trách nhiệm session/proxy/route guard; hiện không hiển thị dữ liệu private.

### Vấn đề còn lại

- `agent-browser` không có trong môi trường; visual verification dùng Edge headless desktop/mobile và HTTP markup smoke-test thay thế.
- Các navigation target ngoài Dashboard sẽ dùng not-found state cho tới task feature tương ứng.

### Kiểm tra

- Lint: Đạt.
- Typecheck: Đạt.
- Build: Đạt; `/app` và `/app/dashboard` prerender thành công.
- HTTP smoke-test: 200, đúng một `main`, một `aside`, hai `nav`; nội dung shell chính xuất hiện.
- Visual: Edge headless xác minh desktop 1440px và mobile 390px; sidebar không che content, mobile header/bottom navigation hiển thị, active Dashboard rõ ràng.
