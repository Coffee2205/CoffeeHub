# AI Memory

## Product direction

- Rebuild CoffeeHub từ đầu.
- UI dark, hiện đại, blue-first.
- Desktop web/PWA và iPhone PWA.
- Dữ liệu đồng bộ qua backend chung.
- Nội dung dài hỗ trợ autosave.
- AI thao tác qua structured action được validate.
- Ưu tiên chi phí thấp; không tự bật dịch vụ trả phí.

## Agent behavior

- Tự chọn task tiếp theo.
- Không yêu cầu người dùng định nghĩa lại từng phiên.
- Không lặp lại quyết định đã bị từ chối hoặc thay đổi kiến trúc khi chưa được xác nhận.


## Session boundary

- Mỗi phiên chỉ xử lý một task hoặc một subtask.
- Sau khi commit và push thành công lên `origin/dev`, agent phải dừng.
- Task kế tiếp chỉ được bắt đầu khi người dùng gửi yêu cầu mới.
