# Task 04 — Database foundation

## Trạng thái

Pending

## Mục tiêu

Chuẩn hóa schema cốt lõi và migration an toàn.

## Dependency

- `03-APP-SHELL.md` phải hoàn thành.

## Công việc

- [ ] Chốt model User/Profile, Goal, Roadmap, RoadmapStage, Task, Event, Note.
- [ ] Chốt timestamps, soft delete và version.
- [ ] Tạo index và unique constraint cần thiết.
- [ ] Tạo migration.
- [ ] Tạo seed demo an toàn.
- [ ] Kiểm tra relation ownership.
- [ ] Ghi ERD hoặc mô tả schema.

## Không thực hiện

- Không thêm AI model đầy đủ nếu chưa đến Task 18.
- Không dùng production data làm seed.
- Không chạy destructive migration mà chưa cảnh báo.

## File dự kiến

- `prisma/schema.prisma`
- `prisma/migrations/*`
- `prisma/seed.*`
- `docs/REPOSITORY_AUDIT.md hoặc database doc bổ sung`
- `project-log/*`

## Ảnh hưởng database

Thay đổi schema chính; bắt buộc review migration và rollback risk.

## Tiêu chí hoàn thành

- Prisma validate/generate đạt.
- Migration không mất dữ liệu ngoài kế hoạch.
- Query private có đường gắn userId.
- Seed không chứa dữ liệu cá nhân thật.
- Build đạt.

## Kết quả thực hiện

### File đã tạo hoặc sửa

- Chưa cập nhật.

### Quyết định kỹ thuật

- Chưa cập nhật.

### Vấn đề còn lại

- Chưa cập nhật.

### Kiểm tra

- Lint: Chưa chạy.
- Typecheck: Chưa chạy.
- Build: Chưa chạy.
- Manual test: Chưa chạy.
