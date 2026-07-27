# CoffeeHub Agent — Shared Rules

## Kiến trúc

Luồng ưu tiên:

```text
UI
→ Server Action hoặc API Route
→ Runtime validation
→ Authentication
→ Authorization
→ Service
→ Repository
→ Prisma
→ PostgreSQL
```

Không bắt buộc tạo đủ layer cho thao tác rất nhỏ, nhưng không được trộn business logic phức tạp vào UI.

## Coding

- Thay đổi nhỏ, rõ ràng và dễ review.
- Không dùng `any` để che lỗi.
- Dùng runtime validation cho form, API, dữ liệu ngoài và AI output.
- Không nuốt lỗi.
- Không cài package mới nếu chưa chứng minh cần thiết.
- Không rewrite module không liên quan.
- Không xóa code chỉ vì chưa hiểu.

## Frontend

- Server Component làm mặc định khi phù hợp.
- Chỉ dùng `"use client"` khi cần browser API hoặc interaction.
- Có loading, empty, error và success state.
- Responsive desktop và iPhone.
- Có keyboard navigation, contrast và touch target hợp lý.
- Giữ concept dark, hiện đại, blue-first.
- Không dùng mock data trong production flow khi task yêu cầu persistence thật.

## Backend và bảo mật

- Không tin `userId` do client gửi.
- Query dữ liệu private phải scope theo current user.
- Validate mọi input.
- Dùng transaction cho thao tác nhiều record.
- Không trả stack trace cho client.
- Không log secret, token, mật khẩu hoặc dữ liệu nhạy cảm.
- Không đưa secret vào `NEXT_PUBLIC_*`.
- Không commit `.env`.

## Database

- Dữ liệu private phải thuộc về user.
- Relation, constraint và index phải rõ ràng.
- Không sửa migration đã áp dụng; tạo migration mới.
- Ưu tiên migration additive.
- Dùng version cho autosave conflict khi cần.
- Dùng idempotency key cho mutation có retry.
- Không tự chạy production migration.

## Autosave và offline

- Debounce nội dung dài khoảng 800–1200 ms.
- Không autosave ngay lần render đầu.
- Hiển thị `Saving`, `Saved`, `Failed`, `Offline`.
- Không ghi đè version mới hơn.
- Optimistic update phải rollback khi lỗi.
- Offline queue dùng IndexedDB và idempotency key.
- Không âm thầm bỏ mutation lỗi.

## AI

Provider ưu tiên:

```text
OpenAI → Groq → Gemini
```

ChatGPT Plus không phải OpenAI API credit.

Luồng AI:

```text
User request
→ Context builder
→ Provider
→ Structured output
→ Runtime validation
→ Proposal
→ Confirmation khi cần
→ Service
→ Transaction
→ Database
→ Audit log
```

AI không được:

- Truy cập Prisma hoặc SQL trực tiếp.
- Nhận toàn bộ database nếu không cần.
- Nhận secret hoặc session token.
- Xóa dữ liệu tự động.
- Thay đổi hàng loạt dữ liệu quan trọng không xác nhận.
- Cho nhiều provider cùng commit một action.

Fallback chỉ dùng cho timeout, rate limit, quota hoặc provider unavailable; không fallback cho lỗi validation, authorization hoặc request không an toàn.

## Git và tự động push nhánh `dev`

### Hành vi bắt buộc sau mỗi đơn vị code hoàn chỉnh

Sau khi hoàn thành một task hoặc subtask có thay đổi code, agent phải:

1. Chạy các kiểm tra phù hợp với `package.json`.
2. Chỉ tiếp tục commit khi các lỗi do thay đổi mới đã được xử lý.
3. Kiểm tra Git status và Git diff.
4. Không đưa secret, `.env`, build output hoặc file không liên quan vào commit.
5. Chuyển sang nhánh `dev`.
6. Nếu nhánh `dev` chưa tồn tại cục bộ nhưng tồn tại trên remote, tạo tracking branch từ `origin/dev`.
7. Nếu nhánh `dev` chưa tồn tại cả local lẫn remote, tạo nhánh local `dev` từ branch hiện tại.
8. Commit toàn bộ thay đổi thuộc đúng task với commit message rõ ràng.
9. Đồng bộ thay đổi mới nhất từ remote bằng cách an toàn.
10. Push commit lên `origin/dev`.
11. Ghi commit hash và kết quả push vào task file và `project-log/CHANGELOG.md`.
12. Dừng phiên ngay sau khi push thành công.
13. Không bắt đầu task kế tiếp cho đến khi người dùng yêu cầu.

### Quy tắc đồng bộ trước khi push

- Ưu tiên `git pull --rebase origin dev` khi working tree sạch và không có commit chưa xử lý.
- Nếu rebase tạo conflict, dừng ngay và báo người dùng.
- Không tự resolve conflict khi có thay đổi không rõ nguồn gốc.
- Không force push.
- Không dùng `--force-with-lease`.
- Không push lên `main`, `master`, `production` hoặc branch khác.
- Không tự merge `dev` vào branch release.
- Không tạo Pull Request nếu người dùng chưa yêu cầu.

### Điều kiện được push

Agent chỉ push khi:

- Đang ở đúng repository.
- Remote `origin` tồn tại.
- Đang ở nhánh `dev`.
- Commit chỉ chứa file thuộc phạm vi task.
- Không phát hiện secret.
- Các kiểm tra liên quan đã chạy hoặc agent đã ghi rõ vì sao không thể chạy.
- Không có merge conflict.
- Push không yêu cầu thay đổi quyền truy cập hoặc cấu hình credential mới.

### Khi không thể push

Nếu thiếu remote, thiếu quyền Git, cần đăng nhập, repository chưa có `origin`, hoặc push bị từ chối:

- Không lặp lại push vô hạn.
- Không thay đổi remote URL.
- Không yêu cầu hoặc hiển thị access token trong log.
- Cập nhật task và project-log với trạng thái `Push blocked`.
- Dừng và báo rõ lệnh đã chạy, lỗi nhận được và bước người dùng cần thực hiện.

### Commit message

Mỗi commit phải tập trung một mục đích, ví dụ:

```text
feat(goals): add goal creation flow
fix(notes): prevent stale autosave overwrite
refactor(ai): extract provider abstraction
docs(project): update task status
test(tasks): cover task completion service
```

## Documentation

Sau mỗi đơn vị công việc:

- Cập nhật task hiện tại.
- Cập nhật `CURRENT_STATUS.md`, `CHANGELOG.md`, `NEXT_STEPS.md`.
- Cập nhật `DECISIONS.md` khi có quyết định lâu dài.
- Cập nhật `TECH_DEBT.md`, `KNOWN_LIMITATIONS.md`, `ISSUES.md` khi cần.
- Cập nhật `AI_MEMORY.md` khi có bài học agent sau phải nhớ.

Không đánh dấu task hoàn thành khi acceptance criteria chưa đạt.


## Giới hạn một task mỗi phiên

- Mỗi yêu cầu chỉ xử lý một task hoặc một subtask được xác định rõ.
- Sau khi push thành công lên `origin/dev`, agent phải dừng.
- Agent có thể đề xuất task kế tiếp trong báo cáo nhưng không được triển khai.
- Không được tiếp tục roadmap tự động trong cùng phiên.
