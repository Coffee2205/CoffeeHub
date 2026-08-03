# Public CV content reference

Nguồn tham khảo: `Tran-Nguyen-Ngoc-Hung-TopCV.vn-010726.124140.pdf` do người dùng cung cấp ngày 2026-08-03.

File này là nguồn nội dung ban đầu cho public CV tại `https://coffeehub.id.vn/`. Đây không phải dữ liệu hard-code: agent phải map vào schema hiện có, cho owner nhập/chỉnh qua Admin/CMS, lưu trong database và chỉ render dữ liệu đã publish.

## Quy tắc quyền riêng tư

| Trường từ CV | Mặc định trên website |
|---|---|
| Tên, chức danh, thành phố, giới thiệu nghề nghiệp | Public khi profile được publish |
| Email liên hệ nghề nghiệp | Public chỉ khi owner bật `show_contact_email` hoặc cơ chế visibility tương đương |
| Số điện thoại | Hidden mặc định; chỉ public khi owner chủ động bật |
| Ngày sinh, giới tính | Không cần hiển thị trên web CV mặc định |
| Auth email | Luôn private; không dùng làm display name hoặc public contact fallback |

Không tạo field trùng nếu database đã có field tương đương. Nếu cần bổ sung visibility/configuration, dùng migration additive và giao diện Admin thay vì SQL thủ công.

## Hồ sơ chính

- Display name: `Tran Nguyen Ngoc Hung`
- Professional title/headline: `FullStack Developer`
- Location: `Thu Duc, Ho Chi Minh City`
- Avatar: dùng ảnh CV làm tham khảo; chỉ upload vào Storage khi có file ảnh phù hợp và owner chấp thuận.
- Contact email candidate: `trannguyenngochung.2005@gmail.com`
- Phone candidate: `0342770402` — hidden mặc định.
- Date of birth candidate: `2005-05-22` — không hiển thị mặc định.
- Gender candidate: `Male` — không hiển thị mặc định.

## Professional objective / About

Creative IT student and Frontend Developer with a strong eye for visual design, specializing in turning ideas into responsive, user-friendly web interfaces. Seeking to join an innovative team where I can apply my expertise in HTML, CSS, JavaScript, Figma, Adobe Illustrator and Photoshop to solve problems and deliver impactful solutions. I enjoy collaborative environments, clean code, visual appeal and usability, and aim to build high-performance, scalable products with strong user experiences. I am passionate about continuous learning and staying current with frontend development trends.

Admin nên hỗ trợ cả `short_bio` dùng ở Hero và `bio`/`objective` đầy đủ dùng ở About.

## Education

- Period: `2023 - Present`
- School: `University of Information Technology - UIT`
- Degree: `Bachelor of Information Technology`
- GPA: `7.3 / 10.0`

## Certifications

- Year: `2021`
- Name: `IELTS`
- Score: `5.5 Overall`
- Details: `Listening 5.5, Reading 6.0, Writing 5.5, Speaking 5.0`

## Activities

1. `Sac Xanh 3 Volunteer Project`
   - Period: `2024`
   - Role: `Participant - Design team`
   - Description: Created promotional materials for the volunteer campaign.
2. `Vi Xuan 6 Volunteer Project`
   - Period: `2025`
   - Role: `Participant - Design team`
   - Description: Created promotional materials for the volunteer campaign.

Nếu schema chưa có Activity, agent phải audit trước: có thể dùng CMS section/entity tổng quát nếu đúng semantics; nếu không, tạo model `activities` additive với ordering, status, ownership và public-published RLS.

## Skills

- Frontend: HTML, CSS, JavaScript, ReactJS, TypeScript.
- Backend: MySQL, Firebase, Python, Node.js.
- AI tools: Claude, Cursor, Gemini và các công cụ AI hỗ trợ phát triển.
- Design and other: Figma, Microsoft Office, Adobe Illustrator, Adobe Photoshop, Git.

Skills phải là entity có category/group và display order; không lưu toàn bộ danh sách thành một chuỗi hard-code nếu schema hiện tại đã hỗ trợ từng skill.

## Projects

### VHealth - Health news website

- Period: `2025-09` đến `2025-12`
- Role: `Leader`
- Highlights:
  - Designed and prototyped accessible, user-friendly UI/UX in Figma.
  - Implemented frontend features for the community page and content sharing.
  - Collaborated on responsive interface development and optimization.

### Blockchain-based Event Ticketing System

- Period: `2026-03` đến `2026-05`
- Role: `Participant`
- Highlights:
  - Designed and implemented responsive UI and user flows with Figma and modern frontend technologies.
  - Applied blockchain-oriented concepts to ticket authenticity and fraud reduction workflows.
  - Built and optimized interactive frontend components for event booking.

Project URLs, repository URLs, tech stack and media were not present in the source PDF. Leave these fields empty or draft until the owner supplies them; do not invent links or technologies.

## Work experience

### NASANI SOFTWARE TECHNOLOGY - Developer

- Period: `2026-01` đến `2026-03`
- Project: `UI/UX & Creative Design Integration`
- Highlights:
  - Used Figma to design and optimize user flows with attention to shopping conversion and cart abandonment.
  - Created marketing assets, banners, custom icons and product imagery with Adobe Illustrator and Adobe Photoshop.

### NASANI SOFTWARE TECHNOLOGY - Intern Developer

- Period: `2025-09` đến `2025-12`
- Project: `Internal Tool for Project Management`
- Highlights:
  - Contributed to a custom internal project-management tool for project tracking and resource allocation.
  - Used React hooks to improve component state management and application performance.

## Public homepage order

1. Hero: display name, professional title, short bio, avatar and CTA.
2. About / objective.
3. Skills grouped by category.
4. Work experience timeline.
5. Featured projects.
6. Education and certifications.
7. Activities.
8. Contact and social links.

Desktop and mobile must preserve readable hierarchy. Empty optional fields are omitted cleanly; the UI must not expose raw nulls, auth email or placeholder personal data.
