import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import {
  archiveStageAction,
  createStageAction,
  moveStageAction,
  updateStageAction,
} from "../roadmap.actions";
import { milestoneProgress } from "../roadmap.schema";
import { ROADMAP_STAGE_STATUSES } from "../roadmap.schema";
import { ArchiveStageButton } from "./archive-stage-button";

type RoadmapData = {
  id: string;
  title: string;
  description: string | null;
  stages: Array<{
    id: string;
    title: string;
    description: string | null;
    startsAt: Date | null;
    endsAt: Date | null;
    status: string;
    successCriteria: unknown;
    tasks: Array<{ id: string; title: string; status: string }>;
  }>;
};

export function RoadmapBoard({
  goalId,
  roadmap,
}: {
  goalId: string;
  roadmap: RoadmapData;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{roadmap.title}</CardTitle>
        <CardDescription>
          {roadmap.description || "Chưa có mô tả roadmap."}
        </CardDescription>
      </CardHeader>
      {roadmap.stages.length ? (
        <ol className="grid gap-4">
          {roadmap.stages.map((stage, index) => {
            const progress = milestoneProgress(
              stage.tasks.map((task) => task.status),
            );
            return (
              <li
                key={stage.id}
                className="rounded-md border border-border bg-surface-subtle p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-primary/15 font-mono text-sm text-primary-hover">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{stage.title}</h3>
                      <Badge
                        variant={
                          progress.status === "COMPLETED"
                            ? "success"
                            : "neutral"
                        }
                      >
                        {progress.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form
                      action={moveStageAction.bind(
                        null,
                        goalId,
                        roadmap.id,
                        stage.id,
                        "up",
                      )}
                    >
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={index === 0}
                        aria-label={`Đưa ${stage.title} lên`}
                      >
                        ↑
                      </Button>
                    </form>
                    <form
                      action={moveStageAction.bind(
                        null,
                        goalId,
                        roadmap.id,
                        stage.id,
                        "down",
                      )}
                    >
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={index === roadmap.stages.length - 1}
                        aria-label={`Đưa ${stage.title} xuống`}
                      >
                        ↓
                      </Button>
                    </form>
                    <ArchiveStageButton
                      action={archiveStageAction.bind(
                        null,
                        goalId,
                        roadmap.id,
                        stage.id,
                      )}
                    />
                  </div>
                </div>
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-background-tertiary"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress.percentage}
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">
                  {progress.percentage}% · {progress.completed}/
                  {stage.tasks.length} Task hoàn thành
                </p>
                {stage.tasks.length ? (
                  <ul className="mt-3 space-y-1 text-xs text-foreground-secondary">
                    {stage.tasks.map((task) => (
                      <li key={task.id}>
                        {task.status === "COMPLETED" ? "✓" : "○"} {task.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-xs text-muted">
                    Task sẽ có thể được gắn vào milestone từ Task 11.
                  </p>
                )}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-primary-hover">
                    Chỉnh milestone
                  </summary>
                  <form
                    action={updateStageAction.bind(
                      null,
                      goalId,
                      roadmap.id,
                      stage.id,
                    )}
                    className="mt-3 grid gap-3"
                  >
                    <Input
                      name="title"
                      required
                      maxLength={180}
                      defaultValue={stage.title}
                      aria-label="Tên milestone"
                    />
                    <Textarea
                      name="description"
                      maxLength={3000}
                      defaultValue={stage.description ?? ""}
                      aria-label="Mô tả milestone"
                    />
                    <div className="grid gap-3 sm:grid-cols-3"><Input name="startsAt" type="date" defaultValue={stage.startsAt?.toISOString().slice(0, 10) ?? ""} /><Input name="endsAt" type="date" defaultValue={stage.endsAt?.toISOString().slice(0, 10) ?? ""} /><select name="status" defaultValue={stage.status} className="min-h-11 rounded-sm border border-border bg-background-secondary px-3">{ROADMAP_STAGE_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></div>
                    <Textarea name="successCriteria" placeholder="One success criterion per line" defaultValue={Array.isArray(stage.successCriteria) ? stage.successCriteria.filter((item): item is string => typeof item === "string").join("\n") : ""} />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="justify-self-start"
                    >
                      Lưu milestone
                    </Button>
                  </form>
                </details>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-md border border-dashed border-border p-5 text-center text-sm text-muted">
          Chưa có milestone. Thêm bước đầu tiên bên dưới.
        </p>
      )}
      <form
        action={createStageAction.bind(null, goalId, roadmap.id)}
        className="mt-5 grid gap-3 rounded-md border border-border bg-background-secondary p-4 sm:grid-cols-[1fr_auto]"
      >
        <label className="grid gap-2">
          <span className="text-sm font-medium">Milestone mới</span>
          <Input
            name="title"
            required
            maxLength={180}
            placeholder="Ví dụ: Hoàn thiện bản thử nghiệm"
          />
        </label>
        <Button type="submit" className="self-end">
          Thêm milestone
        </Button>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-medium">
            Mô tả / tiêu chí hoàn thành
          </span>
          <Textarea
            name="description"
            maxLength={3000}
            placeholder="Kết quả cần đạt để hoàn tất milestone"
          />
        </label>
        <Input name="startsAt" type="date" aria-label="Stage start" />
        <Input name="endsAt" type="date" aria-label="Stage end" />
        <select name="status" defaultValue="PLANNED" className="min-h-11 rounded-sm border border-border bg-background-secondary px-3">{ROADMAP_STAGE_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
        <Textarea name="successCriteria" placeholder="One success criterion per line" />
      </form>
    </Card>
  );
}
