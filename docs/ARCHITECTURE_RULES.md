# Quy tắc kiến trúc — CoffeeHub

## Mục tiêu

Kiến trúc phải hỗ trợ:

- Một codebase Next.js.
- Public website và private application.
- Dữ liệu đồng bộ.
- Autosave.
- PWA và offline queue.
- AI provider abstraction.
- Mở rộng tính năng mà không làm business logic phụ thuộc UI.

## Luồng bắt buộc

```text
UI
→ Server Action hoặc API Route
→ Schema validation
→ Authentication và authorization
→ Service layer
→ Repository layer
→ Prisma
→ Supabase PostgreSQL
```

Không phải mọi chức năng đều bắt buộc tạo đủ số file nếu quá nhỏ, nhưng phải giữ ranh giới trách nhiệm.

## Server Components và Client Components

- Dùng Server Components làm mặc định.
- Chỉ dùng Client Component khi cần state, event browser, animation, IndexedDB hoặc client-only API.
- Không biến cả page thành Client Component chỉ vì một control tương tác.
- Tách phần tương tác thành component nhỏ.

## Feature organization

Cấu trúc tham khảo:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
├── features/
│   ├── goals/
│   ├── roadmaps/
│   ├── tasks/
│   ├── calendar/
│   ├── notes/
│   ├── notifications/
│   ├── sync/
│   └── ai/
└── lib/
```

Mỗi feature có thể chứa:

```text
components/
actions/
services/
repositories/
schemas/
types/
queries/
```

Không bắt buộc tạo folder rỗng.

## Business logic

- Không đặt business rule trong component.
- Không lặp lại cùng một rule ở API và UI.
- Service chịu trách nhiệm rule nghiệp vụ.
- Repository chịu trách nhiệm query persistence.
- UI chỉ xử lý presentation và interaction.

## Validation

- Validate input ở boundary.
- Ưu tiên Zod hoặc schema library đã có trong project.
- Không tin dữ liệu từ client hoặc AI.
- Validate structured AI output trước khi tạo proposal.

## Authentication và authorization

- Supabase Auth là nguồn danh tính duy nhất; phiên phải được xác minh ở server bằng client SSR dùng cookie.
- Email/password là phương thức đầu tiên. OAuth chỉ được thêm bằng task riêng; không mặc định Google và không dùng NextAuth/Auth.js.
- Query private luôn kèm `userId` hoặc ownership condition.
- Không tìm record bằng ID trước rồi mới kiểm tra ở client.
- Không dựa duy nhất vào middleware cho quyền dữ liệu.
- Admin route và mutation phải kiểm tra cả authentication lẫn role/permission; role tin cậy nằm trong `app_metadata`, không lấy từ metadata người dùng tự sửa.

## Database

- Supabase PostgreSQL là database duy nhất; Prisma là lớp truy cập chính cho schema, migration, transaction, repository và type-safe query.
- Supabase SDK chỉ dùng cho Auth, Storage và tính năng đặc thù Supabase. Client không gọi Data API cho business logic; Realtime cần task riêng.
- Bảng thuộc schema được expose phải bật RLS và có policy theo public-published, owner-private hoặc admin. Authorization ở ứng dụng và RLS là hai lớp bổ sung, không thay thế nhau.
- Không dùng policy `public all`, không vô hiệu hóa RLS và không dùng service role làm đường truy cập bình thường.
- Mutation nhiều bản ghi dùng transaction.
- Xóa dữ liệu quan trọng ưu tiên soft delete.
- Bản ghi autosave cần version hoặc cơ chế conflict tương đương.
- Migration phải được review trước khi chạy production.

## Media và tính di động

- File nằm trong Supabase Storage; PostgreSQL chỉ lưu bucket, object path, URL/metadata, MIME, kích thước và alt text.
- Upload phải kiểm tra MIME, kích thước, tên/path, overwrite và orphan cleanup. Bucket private được đọc qua server hoặc signed URL; service role key tuyệt đối không xuống client.
- Mọi thao tác object đi qua Storage API, không sửa trực tiếp schema `storage`.
- Repository/service cho query nghiệp vụ không phụ thuộc Supabase SDK để vẫn có thể chuyển sang PostgreSQL khác.
- Schema và Prisma migrations lưu trong Git; quy trình bàn giao phải có export PostgreSQL, metadata và object Storage, backup trước migration lớn và hướng dẫn recovery.

## Giới hạn chi phí

- Ưu tiên Supabase Free Plan khi phù hợp, nhưng không khẳng định miễn phí vĩnh viễn.
- Không tự bật billing, add-on, nâng gói, tạo nhiều project/bucket hoặc tính năng trả phí.
- Dùng pagination, index, giới hạn upload, nén media, rate limit và cleanup orphan; không polling hoặc bật Realtime cho toàn bộ bảng.

## Error handling

Phân loại tối thiểu:

- Validation error.
- Unauthorized.
- Forbidden.
- Not found.
- Conflict.
- Rate limit.
- Provider unavailable.
- Internal error.

Không trả raw database error hoặc stack trace cho client.

## Autosave

- Debounce ở client.
- Server kiểm tra version.
- Local draft không thay thế database.
- Failed mutation phải có retry hoặc thông báo rõ.
- Offline queue phải hỗ trợ idempotency.

## AI

- Provider không được gọi Prisma.
- AI chỉ trả structured result hoặc text analysis.
- Commit database do AI Action Service thực hiện.
- Một request chỉ có một commit path.
- Provider fallback không được tạo duplicate data.
- Action quan trọng cần confirmation.

## Dependency

- Không cài package mới chỉ để tránh viết vài dòng code đơn giản.
- Trước khi thêm package, agent phải nêu:
  - Lý do.
  - Kích thước/phạm vi ảnh hưởng.
  - Phương án không dùng package.
  - Tình trạng bảo trì.
- Không thêm dịch vụ trả phí khi chưa được xác nhận.

## Refactor

- Không refactor ngoài phạm vi task.
- Refactor lớn phải có task riêng.
- Không đổi naming toàn dự án trong cùng phiên với feature mới nếu không cần thiết.
- Giữ migration path rõ ràng khi thay đổi domain model.
