# CoffeeHub Work Breakdown

## Hierarchy

```text
Epic
└── Feature
    └── Task
        └── Subtask
```

- **Epic**: mục tiêu sản phẩm lớn.
- **Feature**: một khả năng người dùng có thể nhận biết.
- **Task**: một đơn vị delivery có thể hoàn thành trong một phiên hoặc chia nhỏ an toàn.
- **Subtask**: checklist triển khai bên trong task.

## Roadmap

1. [Foundation](epics/00-foundation/EPIC.md)
2. [Public CV and Content Management](epics/01-public-cv-cms/EPIC.md)
3. [Owner Workspace](epics/02-owner-workspace/EPIC.md)
4. [PWA and AI](epics/03-pwa-ai/EPIC.md)
5. [Quality and Release](epics/04-quality-release/EPIC.md)

## Task selection

Mỗi phiên:

1. Đọc `project-log/CURRENT_STATUS.md`.
2. Đọc `project-log/NEXT_STEPS.md`.
3. Mở Feature được trỏ tới.
4. Chọn Task `In Progress`, hoặc Task pending đầu tiên đã sẵn sàng.
5. Thực hiện đúng một Task hoặc Subtask.
6. Kiểm tra kết quả hiển thị/sử dụng.
7. Commit, push `origin/dev`, báo cáo và dừng.

## Visible delivery

Feature có UI không được hoàn thành chỉ bằng schema, service hoặc API.

Task phải ghi rõ:

- URL;
- persona/quyền truy cập;
- cách sử dụng;
- browser verification desktop/mobile;
- dữ liệu thật hoặc trạng thái rỗng;
- ảnh hưởng database;
- commit và push result.

## Adding work

- Feature mới: thêm thư mục trong Epic phù hợp.
- Task mới: thêm file trong `features/<feature>/tasks/`.
- Subtask mới: thêm checklist trong Task.
- Không đánh lại số toàn bộ roadmap khi thêm task.
