# Thiết kế kỹ thuật — CoffeeHub

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
 PostgreSQL / Neon
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
- Neon PostgreSQL.
- Environment tách development/preview/production.
- Migration production có quy trình rõ ràng.
- Không dùng production database cho test tự động.
