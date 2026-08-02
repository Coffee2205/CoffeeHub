# AI Memory

## Product direction

- Rebuild CoffeeHub từ đầu.
- UI dark, hiện đại, blue-first.
- Desktop web/PWA và iPhone PWA.
- Dữ liệu đồng bộ qua backend chung.
- Nội dung dài hỗ trợ autosave.
- AI thao tác qua structured action được validate.
- Ưu tiên chi phí thấp; không tự bật dịch vụ trả phí.
- Nội dung biên tập phải quản trị được từ Admin/CMS.

## Agent behavior

- Mỗi phiên chỉ xử lý một task hoặc subtask.
- Sau khi push `origin/dev`, phải dừng.
- Không yêu cầu người dùng xác định lại task nếu roadmap đã rõ.
- Không tự tiếp tục task kế tiếp.
- Không lặp lại quyết định đã bị từ chối.
# Supabase architecture memory

- Backend duy nhất là Supabase PostgreSQL/Auth/Storage; Prisma phụ trách query nghiệp vụ và migrations.
- Supabase SDK chỉ dành cho Auth, Storage và tính năng đặc thù; service role tuyệt đối server-only.
- Admin mutation kiểm tra session và permission ở server rồi qua service/repository/Prisma; RLS là lớp bổ sung.
- Ưu tiên Free Plan nhưng không tự bật billing/add-on/nâng gói; nội dung phải sửa được qua Admin UI.

## Delivery preference

- User expects visible progress after every task.
- Build vertical slices with a usable route, not isolated backend layers.
- Always report URL, access requirement and usage steps.
- Task 07 public rendering is higher priority than avatar media and Task 08.


## CV access model

- Public visitors see the owner's published CV without authentication.
- Never introduce a guest account to unlock portfolio information.
- Owner login enters `/app/dashboard`.
- Owner has full workspace access and Admin/CMS access.
- Protect Goals, Tasks, Notes, Calendar, settings and AI history.


## Work breakdown memory

- Use Epic → Feature → Task → Subtask.
- Use `agent/CONTINUE.md` for normal sessions.
- Complete only one Task or Subtask per session.
- Visible UI/result is required for feature delivery.
- Push `origin/dev`, then stop.
