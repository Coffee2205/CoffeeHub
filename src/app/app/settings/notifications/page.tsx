import Link from "next/link";
import { Badge, Button, Card, EmptyState, Input } from "@/components/ui";
import { formatDateTimeLocal } from "@/features/calendar/event.schema";
import {
  createReminderAction,
  cancelReminderAction,
  savePreferenceAction,
} from "@/features/notifications/notification.actions";
import {
  listNotificationSettings,
  reminderDeepLink,
} from "@/features/notifications/notification.repository";
import { BrowserPermission } from "@/features/notifications/components/browser-permission";
import { requireUser } from "@/lib/supabase/auth";
const recurrenceLabels = {
  NONE: "Một lần",
  DAILY: "Hằng ngày",
  WEEKLY: "Hằng tuần",
  MONTHLY: "Hằng tháng",
};
export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await requireUser();
  const [data, query] = await Promise.all([
    listNotificationSettings(user.id),
    searchParams,
  ]);
  return (
    <div className="space-y-6">
      <header>
        <Badge variant="primary">Settings</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Nhắc việc & thông báo</h1>
        <p className="mt-2 max-w-3xl text-foreground-secondary">
          Quản lý reminder trong CoffeeHub. Không có cam kết gửi nền hoặc push
          khi ứng dụng đã đóng.
        </p>
      </header>
      {query.saved ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 p-3 text-sm text-green-200"
        >
          Đã lưu thay đổi.
        </p>
      ) : null}
      {query.error ? (
        <p
          role="alert"
          className="rounded-sm border border-error/30 bg-error/10 p-3 text-sm text-red-200"
        >
          {query.error}
        </p>
      ) : null}
      <Card>
        <h2 className="text-xl font-semibold">Quyền và giới hạn</h2>
        <div className="mt-4">
          <BrowserPermission />
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          Trên iPhone, thông báo web phụ thuộc phiên bản iOS, việc cài PWA lên
          Home Screen, quyền người dùng và chính sách tiết kiệm pin. CoffeeHub
          v1 chưa có scheduling backend/service worker push nên không bảo đảm
          giao notification khi app đóng.
        </p>
      </Card>
      <form
        action={savePreferenceAction}
        className="grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-3"
      >
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            name="inAppEnabled"
            defaultChecked={data.preference?.inAppEnabled ?? true}
          />{" "}
          In-app
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            name="browserEnabled"
            defaultChecked={data.preference?.browserEnabled ?? false}
          />{" "}
          Browser intent
        </label>
        <label className="grid gap-2 text-sm">
          Báo trước mặc định (phút)
          <Input
            type="number"
            name="defaultLeadMinutes"
            min={0}
            max={10080}
            defaultValue={data.preference?.defaultLeadMinutes ?? 15}
          />
        </label>
        <div className="sm:col-span-3">
          <Button type="submit">Lưu tùy chọn</Button>
        </div>
      </form>
      <form
        action={createReminderAction}
        className="grid gap-4 rounded-lg border border-border bg-surface p-5 md:grid-cols-2"
      >
        <h2 className="text-xl font-semibold md:col-span-2">Tạo reminder</h2>
        <label className="grid gap-2 text-sm md:col-span-2">
          Tiêu đề
          <Input name="title" required maxLength={220} />
        </label>
        <label className="grid gap-2 text-sm">
          Thời điểm
          <Input type="datetime-local" name="scheduledFor" required />
        </label>
        <label className="grid gap-2 text-sm">
          Múi giờ
          <Input name="timezone" required defaultValue={data.timezone} />
        </label>
        <label className="grid gap-2 text-sm">
          Lặp
          <select
            name="recurrence"
            className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"
          >
            {Object.entries(recurrenceLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <Relation name="goalId" label="Goal" items={data.goals} />
        <Relation name="taskId" label="Task" items={data.tasks} />
        <Relation name="eventId" label="Event" items={data.events} />
        <Relation
          name="checklistId"
          label="Checklist"
          items={data.checklists}
        />
        <p className="text-xs text-muted md:col-span-2">
          Chỉ chọn tối đa một entity. Reminder sẽ mở deep link đến entity đó.
        </p>
        <div className="md:col-span-2">
          <Button type="submit">Tạo reminder</Button>
        </div>
      </form>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Reminder hiện có</h2>
        {data.reminders.length ? (
          <div className="grid gap-3">
            {data.reminders.map((reminder) => (
              <Card
                key={reminder.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        reminder.status === "ACTIVE" ? "primary" : "neutral"
                      }
                    >
                      {reminder.status}
                    </Badge>
                    <Badge variant="neutral">
                      {recurrenceLabels[reminder.recurrence]}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-semibold">{reminder.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateTimeLocal(
                      reminder.scheduledFor,
                      reminder.timezone,
                    )}{" "}
                    · {reminder.timezone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={reminderDeepLink(reminder)}
                    className="inline-flex min-h-10 items-center rounded-sm border border-border px-3 text-sm"
                  >
                    Mở entity
                  </Link>
                  {reminder.status === "ACTIVE" ? (
                    <form action={cancelReminderAction.bind(null, reminder.id)}>
                      <Button type="submit" size="sm" variant="secondary">
                        Hủy
                      </Button>
                    </form>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có reminder"
            description="Tạo reminder đầu tiên và tùy chọn một entity để mở bằng deep link."
          />
        )}
      </section>
    </div>
  );
}
function Relation({
  name,
  label,
  items,
}: {
  name: string;
  label: string;
  items: Array<{ id: string; title: string }>;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <select
        name={name}
        className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"
      >
        <option value="">Không liên kết</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>
    </label>
  );
}
