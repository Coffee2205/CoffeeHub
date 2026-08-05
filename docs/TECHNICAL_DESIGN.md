# Thiết kế kỹ thuật — CoffeeHub

## AI Foundation implementation

The provider registry owns OpenAI/Groq/Gemini stubs and Mock Provider, while a single server-only config boundary reads environment values. `/app/ai` uses an authenticated Server Action to produce a runtime-validated mock proposal and passes only serializable preview data to the Client Component. Confirmation/save is disabled and no AI persistence migration exists.

## 1. Tổng quan hệ thống

```text
Browser / Installed PWA
          │
          ▼
      Next.js App
          │
   ┌──────┴──────┐
   │             │
Server UI     API/Actions
   │             │
   └──────┬──────┘
          ▼
    Domain Services
          │
    Repositories
          │
       Prisma
          │
 Supabase PostgreSQL
```

Hệ thống AI đi qua backend:

```text
User Request
→ AI Orchestrator
→ OpenAI / Groq / Gemini
→ Structured Output Validation
→ Proposal
→ Confirmation Policy
→ AI Action Service
→ Transaction
→ Database
→ Audit Log
```

## 2. Runtime

Agent phải audit repository để xác nhận:

- Phiên bản Next.js.
- App Router hay Pages Router.
- Runtime Node hay Edge cho từng route.
- Prisma compatibility.
- Thư viện auth.
- Thư viện PWA.

Không được giả định phiên bản trước khi đọc `package.json`.

## 3. Data fetching

- Server-side fetch cho trang cần dữ liệu ban đầu.
- Client query/refetch cho phần tương tác động nếu cần.
- Refetch khi tab focus hoặc sau mutation ở giai đoạn đầu.
- Chưa cần realtime nếu nhu cầu cá nhân được đáp ứng.

## 4. Mutation

Mỗi mutation phải:

1. Parse input.
2. Xác thực session.
3. Kiểm tra ownership.
4. Thực hiện service rule.
5. Lưu qua repository.
6. Trả response có cấu trúc.
7. Revalidate/refetch dữ liệu liên quan.

## 5. Optimistic update

Dùng cho:

- Toggle task.
- Toggle checklist item.
- Thay đổi trạng thái nhỏ.
- Reorder khi UX cần phản hồi nhanh.

Luồng:

```text
Update UI
→ Send mutation
→ Success: reconcile server result
→ Failure: rollback + toast
```

## 6. Autosave

Client state tối thiểu:

```text
idle
saving
saved
error
offline
syncing
conflict
```

Payload autosave nên có:

```json
{
  "id": "record-id",
  "content": "...",
  "version": 3,
  "idempotencyKey": "..."
}
```

Server cập nhật khi version khớp và trả version mới.

## 7. Offline storage

IndexedDB chứa:

- Draft theo entity.
- Pending mutation queue.
- Metadata sync.

Không lưu secret hoặc session token thủ công trong IndexedDB nếu auth solution không yêu cầu.

Mutation queue record gợi ý:

```text
id
userId hoặc local scope phù hợp
entityType
entityId
action
payload
idempotencyKey
createdAt
retryCount
status
```

## 8. Database model định hướng

Model dự kiến:

- User.
- Profile.
- Education.
- Skill.
- Experience.
- Project.
- Goal.
- GoalProgressEntry.
- Roadmap.
- RoadmapStage.
- Task.
- Event.
- Note.
- Checklist.
- ChecklistItem.
- Reminder.
- NotificationPreference.
- AIConversation.
- AIMessage.
- AIActionLog.
- IdempotencyRecord.

Schema cuối phải được quyết định sau repository audit.

## 9. AI provider abstraction

Interface khái niệm:

```ts
interface AIProvider {
  name: string;
  generateText(input: AITextRequest): Promise<AITextResponse>;
  generateStructured<T>(
    input: AIStructuredRequest<T>,
  ): Promise<AIStructuredResponse<T>>;
}
```

Orchestrator chịu trách nhiệm:

- Chọn provider.
- Timeout.
- Fallback.
- Chuẩn hóa error.
- Ghi usage metadata phù hợp.

Provider không chịu trách nhiệm commit database.

## 10. Idempotency

Dùng cho:

- Offline retry.
- AI action confirm.
- Batch create.
- Mutation có khả năng bấm lặp.

Backend phải trả kết quả cũ khi cùng user và cùng key đã hoàn thành.

## 11. Audit

AIActionLog tối thiểu lưu:

- User.
- Provider.
- Model nếu có.
- Action type.
- Status.
- Proposed data.
- Committed data.
- Confirmation state.
- Error.
- Timestamps.

Không lưu secret hoặc raw token.

## 12. PWA

- Manifest.
- Icons.
- Standalone display.
- Service worker.
- Offline fallback.
- Cache app shell thận trọng.
- Không cache response private theo cách có thể lộ dữ liệu giữa session.
- Test Add to Home Screen trên iPhone.

## 13. Notification

Kiến trúc cuối phụ thuộc khả năng PWA và hạ tầng miễn phí.

Cần tách:

- Reminder domain.
- Scheduling mechanism.
- Push subscription.
- Delivery log nếu được triển khai.

Không hứa notification khi app đóng trên mọi môi trường nếu chưa kiểm chứng.

## 14. Deployment

- Vercel cho Next.js.
- Supabase làm backend platform: PostgreSQL, Auth và Storage.
- Environment tách development/preview/production.
- Migration production có quy trình rõ ràng.
- Không dùng production database cho test tự động.

## 15. Supabase integration

```text
Admin UI → file validation → Supabase Storage
                              ↓
             bucket/path/URL/metadata → Prisma → Supabase PostgreSQL

Supabase Auth → cookie session → server verification
              → role/permission → protected route or mutation
```

- Tạo browser/server clients bằng `@supabase/supabase-js` và `@supabase/ssr`; server client đọc/ghi cookie theo API Next.js hiện hành. Không tin session chỉ đọc từ UI.
- Prisma client là singleton an toàn cho development và dùng `DATABASE_URL` pooled phù hợp Vercel. Prisma migration, `pg_dump` và công cụ dài hạn dùng `DIRECT_URL`/direct connection do dashboard cung cấp; không ghi cố định định dạng chuỗi kết nối vào tài liệu.
- Mapping hồ sơ ứng dụng tham chiếu `auth.users.id`; role quản trị tin cậy lấy từ `app_metadata` và được kiểm tra tại service/action. RLS là lớp phòng vệ cho đường truy cập Supabase API, không thay kiểm tra quyền trong server code.
- Storage bắt đầu với bucket tối thiểu theo feature. Có thể tách `avatars`, `projects`, `posts`, `site-assets` khi task thực sự cần; không tạo tất cả ở bootstrap.
- Public media chỉ dùng public bucket khi nội dung đã xuất bản. Draft/private dùng private bucket và signed URL hoặc server delivery. Delete phải xử lý cả record tham chiếu lẫn object theo thứ tự có rollback/cleanup.
- Không bật Realtime mặc định. Chỉ thêm khi task riêng chứng minh polling/refetch không đủ và đã đánh giá quota.

## 17. Delivery architecture: visible vertical slices

Mỗi feature được triển khai theo luồng hoàn chỉnh:

```text
Route/page
→ UI states
→ action/API
→ validation và authorization
→ service/repository
→ database/storage
→ render lại kết quả
```

Không chia milestone theo từng tầng backend/frontend độc lập nếu điều đó khiến branch build được nhưng người dùng không có gì để xem. Các foundation kỹ thuật chỉ được xem là milestone khi chúng hỗ trợ ngay một trang diagnostic hoặc một feature route đang dùng được.

Mỗi pull/commit kết thúc task phải ghi:

- route đã thêm hoặc thay đổi;
- persona có quyền truy cập;
- dữ liệu cần chuẩn bị;
- thao tác kiểm thử;
- desktop/mobile viewport đã kiểm tra.


## Public CV và owner workspace routing

### Anonymous request

```text
GET public route
→ no auth requirement
→ public content service
→ published-only repository
→ Supabase PostgreSQL/RLS
→ public DTO
→ render CV
```

### Owner login

```text
POST login
→ Supabase Auth
→ cookie session
→ validate safe next path
→ /app/dashboard
```

### Protected request

```text
GET /app/*
→ proxy refresh
→ server requireOwner
→ private service/repository
→ owner-scoped data
```

### CMS request

```text
GET/POST /admin/*
→ requireOwnerAdmin
→ content validation
→ CMS service/repository
→ draft/publish workflow
```

Production không có public signup hoặc guest login. Nếu signup route cần cho bootstrap, phải bị tắt/ẩn trước production release.

Public DTO không được chứa auth email, internal IDs không cần thiết, ownership metadata, draft fields hoặc private app data.

## 18. Display identity và public CV

- `auth.users.email` chỉ là credential identifier; UI không được dùng email hoặc local-part làm display name.
- Public CV `/` đọc `profiles.display_name`, headline, bio, avatar và các entity đã publish qua public DTO tối thiểu.
- Owner có session vẫn nhận cùng public CV; auth state chỉ bổ sung CTA Dashboard/Manage CV.
- Nội dung khởi tạo tham khảo `docs/PUBLIC_CV_CONTENT_REFERENCE.md` và phải được nhập/chỉnh qua CMS/database, không hard-code trong component.

## 19. Chat persistence và confirmed AI actions

- Chat text response và database action là hai kết quả khác nhau trong một conversation.
- AIConversation/AIMessage lưu owner, role, content/parts, provider/model metadata cần thiết và timestamps; không lưu secret hoặc toàn bộ context dump.
- Structured `AIActionProposal` chứa action type, schema version, payload đã validate, human-readable diff, proposal hash/version, status và expiry.
- Confirm request không nhận `userId` từ client; server lấy user từ session, load lại proposal theo owner, kiểm tra hash/version/status, parse payload bằng feature schema và gọi service hiện có.
- Batch planning dùng transaction; retry dùng idempotency key; success ghi committed identifiers vào audit và trả route để mở entity.
- Provider không được import Prisma/repository, sinh SQL để chạy, đổi quyền hoặc bypass RLS/service authorization.
