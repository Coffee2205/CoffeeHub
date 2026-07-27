# CoffeeHub Agent — Shared Rules

## Coding

- Thay đổi nhỏ, rõ ràng và đúng phạm vi task.
- Không dùng `any` để che lỗi.
- Validate runtime cho form, API, external data và AI output.
- Không nuốt lỗi.
- Không cài dependency nếu chưa có nhu cầu thực tế.
- Không rewrite module không liên quan.
- Không xóa code chỉ vì chưa hiểu.

## Kiến trúc

Luồng ưu tiên:

```text
UI
→ Server Action/API
→ validation
→ authentication
→ authorization
→ service
→ repository
→ Prisma
→ Supabase PostgreSQL
```

Có thể rút gọn cho thao tác nhỏ, nhưng business logic phức tạp không đặt trong UI.

## Frontend

- Server Component làm mặc định khi phù hợp.
- Chỉ dùng `"use client"` khi cần interaction hoặc browser API.
- Có loading, empty, error và success state.
- Responsive desktop và iPhone.
- Có keyboard navigation, contrast và touch target hợp lý.
- Tuân thủ `docs/DESIGN_RULES.md`.

## Content-first và Admin/CMS

Nội dung có khả năng thay đổi sau bàn giao không được hard-code.

Mặc định phải quản trị được:

- hồ sơ cá nhân;
- dự án và ảnh dự án;
- kinh nghiệm, kỹ năng, học vấn;
- bài viết;
- banner và nội dung landing page;
- menu, footer và liên kết;
- FAQ;
- SEO metadata;
- trạng thái publish/unpublish;
- thứ tự hiển thị;
- site settings.

Một loại nội dung mới phải được phân loại:

1. **Code constant**: hằng kỹ thuật như route hoặc permission.
2. **Site setting**: một giá trị cấu hình toàn site.
3. **CMS entity**: danh sách nội dung có CRUD.
4. **Feature flag**: bật/tắt hành vi có kiểm soát.

Nếu là Site setting hoặc CMS entity, task phải bao gồm schema, validation, CRUD, quyền truy cập, giao diện quản trị và kết nối phần hiển thị.

Người dùng không cần thao tác database trực tiếp. Database vẫn là nơi lưu dữ liệu phía sau.

## Backend và bảo mật

- Không tin `userId` do client gửi.
- Dữ liệu private phải scope theo current user.
- Validate mọi input.
- Dùng transaction cho thao tác nhiều record.
- Không trả stack trace cho client.
- Không log secret, token hoặc dữ liệu nhạy cảm.
- Không đưa secret vào `NEXT_PUBLIC_*`.
- Không commit `.env`.
- Admin route phải yêu cầu authentication và authorization.

## Database

- Backend chuẩn là Supabase: PostgreSQL, Auth và Storage; deployment frontend là Vercel.
- Prisma xử lý schema, migration, transaction và query nghiệp vụ. Supabase SDK không thay Prisma cho repository thông thường.
- Database URL runtime dùng kết nối pooled phù hợp môi trường; migration/backup dùng kết nối direct do Supabase cung cấp. Không hard-code hostname, port hoặc connection format.
- Bảng expose phải bật RLS với policy cụ thể. `UPDATE` cần cả quyền đọc phù hợp và điều kiện `USING`/`WITH CHECK`; view expose phải cân nhắc `security_invoker`.
- Không dùng service role để né RLS trong luồng bình thường; key này chỉ ở server và chỉ khi thật sự cần quyền quản trị.
- Relation, constraint và index phải rõ ràng.
- Không sửa migration đã áp dụng; tạo migration mới.
- Ưu tiên migration additive.
- Không tự chạy production migration.
- Dùng version cho autosave conflict khi cần.
- Dùng idempotency key cho mutation có retry.
- Nội dung công khai phải có trạng thái publish rõ ràng.

## Supabase Auth và Storage

- Dùng Supabase Auth email/password trước; session được xác minh server-side, route và mutation nhạy cảm kiểm tra role/permission.
- Role tin cậy dùng `app_metadata`; không dùng `user_metadata` làm nguồn phân quyền.
- Supabase Storage lưu file; PostgreSQL chỉ lưu tham chiếu và metadata. Upload kiểm tra MIME, kích thước, path, alt text và orphan cleanup.
- Policy Storage nằm trên `storage.objects`; thao tác upsert cần quyền `INSERT`, `SELECT` và `UPDATE` phù hợp.
- `SUPABASE_SERVICE_ROLE_KEY`, database URL và AI keys không bao giờ có prefix `NEXT_PUBLIC_`, không log và không đưa xuống browser.

## Autosave và offline

- Debounce nội dung dài khoảng 800–1200 ms.
- Không autosave ở lần render đầu.
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

AI phải đi qua:

```text
request
→ context builder
→ provider
→ structured output
→ runtime validation
→ proposal
→ confirmation khi cần
→ service
→ transaction
→ database
→ audit log
```

AI không được truy cập Prisma/SQL trực tiếp, nhận secret, xóa dữ liệu tự động hoặc commit cùng một action qua nhiều provider.

Fallback chỉ dùng cho timeout, rate limit, quota hoặc provider unavailable.

## Git: commit và push `dev`

Sau khi hoàn thành một task hoặc subtask:

1. Chạy kiểm tra phù hợp.
2. Kiểm tra `git status` và `git diff`.
3. Loại secret, `.env`, build output và file không liên quan.
4. Chuyển sang branch `dev`.
5. Nếu cần, tạo tracking branch từ `origin/dev`.
6. Commit với message tập trung một mục đích.
7. Khi working tree sạch, đồng bộ bằng `git pull --rebase origin dev`.
8. Push lên `origin/dev`.
9. Ghi commit hash và push result vào task và changelog.
10. Dừng phiên.

Không được:

- push lên `main`, `master`, `production`;
- force push hoặc `--force-with-lease`;
- tự resolve conflict không rõ nguồn gốc;
- đổi remote URL;
- hiển thị access token;
- lặp push vô hạn.

Nếu thiếu remote, credential, quyền truy cập hoặc gặp conflict: ghi `Push blocked`, báo lỗi và dừng.

## Documentation

Sau mỗi phiên cập nhật:

- task hiện tại;
- `CURRENT_STATUS.md`;
- `NEXT_STEPS.md`;
- `CHANGELOG.md`;
- file log chuyên biệt khi có quyết định, issue, limitation hoặc technical debt.

Không đánh dấu `Completed` khi acceptance criteria chưa đạt.
