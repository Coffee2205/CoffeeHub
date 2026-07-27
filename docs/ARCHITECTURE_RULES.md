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
→ PostgreSQL
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

- Kiểm tra session ở server.
- Query private luôn kèm `userId` hoặc ownership condition.
- Không tìm record bằng ID trước rồi mới kiểm tra ở client.
- Không dựa duy nhất vào middleware cho quyền dữ liệu.

## Database

- Prisma là data access layer chính nếu repository hiện tại đã dùng Prisma.
- Mutation nhiều bản ghi dùng transaction.
- Xóa dữ liệu quan trọng ưu tiên soft delete.
- Bản ghi autosave cần version hoặc cơ chế conflict tương đương.
- Migration phải được review trước khi chạy production.

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
