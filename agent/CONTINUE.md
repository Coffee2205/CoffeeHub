# CoffeeHub — Continue Current Work

Dùng file này cho mọi phiên sau khi project đã được khởi tạo.

## Instruction

1. Đọc `MANIFEST.md` và `agent/MASTER.md`.
2. Đọc toàn bộ `project-log/`.
3. Đọc `tasks/README.md`.
4. Mở Feature và Task được chỉ định trong `project-log/NEXT_STEPS.md`.
   - Với public CV, đọc `docs/PUBLIC_CV_CONTENT_REFERENCE.md` và quyết định D-012.
   - Với AI, đọc quyết định D-013 cùng `docs/AI_ACTIONS.md`, `docs/AI_ARCHITECTURE.md` và `docs/AI_SECURITY.md`.
5. Nếu có Task `In Progress`, tiếp tục đúng Task đó.
6. Nếu không có Task `In Progress`, chọn Task pending đầu tiên của Feature đã sẵn sàng.
7. Chỉ thực hiện một Task hoặc một Subtask trong phiên.
8. Không tự thay đổi Epic, Feature hoặc kiến trúc.
9. Không bỏ qua visible delivery:
   - route hoặc màn hình phải mở được;
   - interaction phải sử dụng được;
   - dữ liệu thật hoặc empty state hợp lý;
   - browser test desktop và mobile khi có UI.
10. Sau khi hoàn thành:
    - chạy validation;
    - cập nhật Feature/Task và project-log;
    - commit;
    - pull --rebase `origin/dev` nếu an toàn;
    - push `origin/dev`;
    - báo cáo;
    - dừng hoàn toàn.

## Stop rule

Không tự bắt đầu Task tiếp theo sau khi push. Chỉ tiếp tục khi người dùng gửi yêu cầu mới.

## User command

Người dùng chỉ cần nói:

```text
Đọc `agent/CONTINUE.md` và tiếp tục task hiện tại.
```
