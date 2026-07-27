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
