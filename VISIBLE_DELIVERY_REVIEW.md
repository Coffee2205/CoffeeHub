# Visible Delivery Review

## Vấn đề phát hiện

Roadmap cũ cho phép nhiều subtask hoàn thành ở schema, migration, repository và Admin CRUD nhưng chưa buộc phần dữ liệu đó xuất hiện trên website công khai. Task 17 mới là Public Landing, khiến người dùng có thể phải chờ rất lâu mới nhìn thấy sản phẩm hoàn chỉnh.

Task 07 đã có nhiều module CMS nhưng `/` vẫn là design preview. Vì vậy trạng thái `In Progress` là đúng, nhưng thứ tự 07C4 avatar trước 07D public rendering không phù hợp với nhu cầu nhìn thấy thành quả.

## Thay đổi chính

- Bổ sung Definition of Done theo visible vertical slice ở agent, workflow, rules, PRD, technical design, tasks README và task template.
- Mọi feature task phải ghi route, luồng sử dụng, dữ liệu và browser verification desktop/mobile.
- Ưu tiên Task 07D1 public home trước avatar.
- Task 07 yêu cầu `/`, `/about`, `/projects`, `/posts` và preview Admin đọc dữ liệu CMS.
- Task 17 đổi thành public-site polish, không còn là lần đầu xây website công khai.
- Task 08 được tách khỏi CMS để tránh xây lại Profile/Experience/Skill/Project CRUD.
- Thêm Visible Deliverable cho các Task 09–21.
- Cập nhật project-log để agent tiếp theo không bắt đầu task khác trước public rendering.

## Kết quả mong đợi sau phiên code tiếp theo

Người dùng mở `/` và thấy website CoffeeHub thật. Admin publish thay đổi trong CMS, sau đó anonymous visitor thấy nội dung thay đổi mà không sửa code hoặc database trực tiếp.

Documentation consistency check: PASSED
