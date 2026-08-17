import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient, TaskStatus } from "../src/generated/prisma/client";
import { localDateTimeToUtc } from "../src/features/calendar/event.schema";

dotenv.config({ path: ".env.local" });

const SOURCE = "japanese-study-plan-2026-2027";
const GOAL_TITLE = "Đạt JLPT N3 tiếng Nhật";
const ROADMAP_TITLE = "Japanese 0 → JLPT N3";
const REQUIRED_HEADERS = ["Ngày", "Thứ", "Giai đoạn", "Tuần", "Buổi", "Công việc chính", "Chi tiết 120 phút", "Tài liệu", "Kết quả cần đạt", "Buổi học chính?", "Trạng thái", "Ghi chú"] as const;

type Row = Record<(typeof REQUIRED_HEADERS)[number], string>;
type Workbook = { sheet: string; headers: string[]; rows: Row[] };
type StageDefinition = { title: string; startsAt: string; endsAt: string; description: string; successCriteria: string[] };

const STAGES: Record<string, StageDefinition> = {
  "Nhập môn": { title: "Nhập môn", startsAt: "2026-08-17", endsAt: "2026-08-30", description: "Hiragana, Katakana, âm đục, âm ghép, trường âm, 促音, phát âm, số, ngày giờ và giới thiệu cơ bản.", successCriteria: ["Đọc Kana với độ chính xác >= 90%"] },
  "N5 - Kiến thức": { title: "JLPT N5", startsAt: "2026-08-31", endsAt: "2026-11-29", description: "Từ vựng, Kanji, ngữ pháp, đọc và nghe với Dũng Mori N5 và Anki.", successCriteria: ["Hoàn thành toàn bộ kiến thức N5"] },
  "N5 - Củng cố": { title: "Củng cố N5", startsAt: "2026-11-30", endsAt: "2026-12-13", description: "Tổng ôn, mini mock và cập nhật error log N5.", successCriteria: ["Điểm luyện N5 ổn định >= 75%"] },
  "N4 - Kiến thức": { title: "JLPT N4", startsAt: "2026-12-14", endsAt: "2027-03-14", description: "Hoàn thành kiến thức N4 với Dũng Mori N4 và Anki.", successCriteria: ["Hoàn thành toàn bộ kiến thức N4"] },
  "N4 - Luyện đề": { title: "Luyện N4", startsAt: "2027-03-15", endsAt: "2027-04-30", description: "Vocabulary, grammar, reading, listening timed, mock test và chữa lỗi.", successCriteria: ["Mock N4 ổn định khoảng >= 75%"] },
  "N3 - Kiến thức": { title: "JLPT N3", startsAt: "2027-05-01", endsAt: "2027-09-19", description: "Dũng Mori N3, Anki và Shinkanzen N3 Reading/Grammar/Listening.", successCriteria: ["Hoàn thành toàn bộ kiến thức N3"] },
  "N3 - Luyện kỹ năng": { title: "Luyện kỹ năng N3", startsAt: "2027-09-20", endsAt: "2027-10-31", description: "Vocabulary/Kanji, Grammar, Reading, Listening timed và section mock.", successCriteria: ["Các kỹ năng ổn định khoảng 70–80%"] },
  "N3 - Tổng ôn": { title: "Tổng ôn N3", startsAt: "2027-11-01", endsAt: "2027-11-30", description: "Full mock, error log, chữa lỗi, tăng tốc đọc, listening và ổn định điểm.", successCriteria: ["Sẵn sàng thi JLPT N3"] },
};

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseWorkbook(file: string): Workbook {
  const result = spawnSync("python", [resolve("prisma/parse-study-plan-xlsx.py"), resolve(file), "Lịch từng ngày"], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || "Unable to parse workbook.");
  const workbook = JSON.parse(result.stdout) as Workbook;
  const missing = REQUIRED_HEADERS.filter((header) => !workbook.headers.includes(header));
  if (missing.length) throw new Error(`Workbook is missing columns: ${missing.join(", ")}`);
  return workbook;
}

function slug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}

function resources(value: string) {
  return value.split(/\s*\+\s*|\s*;\s*/).map((name) => name.trim()).filter(Boolean).map((name) => ({ name, type: /anki/i.test(name) ? "app" : "material" }));
}

function checklistItems(value: string) {
  return value.split(/\s*\+\s*/).map((segment) => segment.trim()).filter(Boolean).map((segment) => {
    const match = /^(\d+)(?:[–-](\d+))?\s*['’]?\s*(.+)$/.exec(segment);
    if (!match) return segment;
    const duration = match[2] ? `${match[1]}–${match[2]}` : match[1];
    return `${match[3].trim()} — ${duration} phút`;
  });
}

function status(value: string) {
  const normalized = value.toLocaleLowerCase("vi");
  return normalized.includes("hoàn thành") || normalized.includes("đã học") ? TaskStatus.COMPLETED : TaskStatus.TODO;
}

function dateAt(date: string, time: string, timezone: string) {
  const instant = localDateTimeToUtc(`${date}T${time}`, timezone);
  if (!instant) throw new Error(`Invalid local datetime ${date} ${time} in ${timezone}`);
  return instant;
}

function dateOnly(date: string, endOfDay = false) {
  return new Date(`${date}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
}

const REVIEW_ITEMS = ["Kiểm tra từ vựng", "Kiểm tra Kanji", "Kiểm tra ngữ pháp", "Đọc", "Nghe", "Cập nhật error log"];

async function main() {
  const file = argument("--file") ?? "lo_trinh_tieng_nhat_0_N4_N3_2026_2027.xlsx";
  const defaultTime = argument("--default-time");
  let userId = argument("--user-id") ?? process.env.SEED_USER_ID;
  const dryRun = process.argv.includes("--dry-run");
  const verifyIdempotency = process.argv.includes("--verify-idempotency");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(defaultTime ?? "")) throw new Error("--default-time HH:mm is required because Events require a start time.");
  const workbook = parseWorkbook(file);
  if (workbook.rows.length !== 471) throw new Error(`Expected 471 dated rows, received ${workbook.rows.length}.`);
  for (const row of workbook.rows) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row["Ngày"])) throw new Error(`Invalid date: ${row["Ngày"]}`);
    if (!STAGES[row["Giai đoạn"]]) throw new Error(`Unknown stage: ${row["Giai đoạn"]}`);
  }
  const requiredRows = workbook.rows.filter((row) => row["Buổi học chính?"] === "Có");
  const restRows = workbook.rows.filter((row) => row["Buổi học chính?"] === "Không");
  const checks = new Map(workbook.rows.map((row) => [row["Ngày"], row]));
  for (const [date, title] of [["2026-08-17", "Hiragana 1"], ["2026-08-18", "Hiragana 2"], ["2026-08-21", "Katakana 2"]]) {
    if (checks.get(date)?.["Công việc chính"] !== title) throw new Error(`Validation failed for ${date}: expected ${title}.`);
  }
  if (["2026-08-22", "2026-08-23"].some((date) => checks.get(date)?.["Buổi học chính?"] !== "Không")) throw new Error("Weekend validation failed.");
  if (dryRun) {
    console.log(JSON.stringify({ mode: "dry-run", rows: workbook.rows.length, requiredTasks: requiredRows.length, restDaysSkipped: restRows.length, stages: Object.keys(STAGES).length }, null, 2));
    return;
  }
  if (!userId || !process.env.DATABASE_URL) throw new Error("SEED_USER_ID/user-id and DATABASE_URL are required.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  if (verifyIdempotency) {
    try {
      const expectedKeys = requiredRows.map((row) => `${SOURCE}:${row["Ngày"]}:${slug(row["Công việc chính"])}`);
      const [goals, roadmaps, stages, tasks, events] = await Promise.all([
        prisma.goal.count({ where: { title: GOAL_TITLE, deletedAt: null } }),
        prisma.roadmap.count({ where: { title: ROADMAP_TITLE, deletedAt: null } }),
        prisma.roadmapStage.count({ where: { roadmap: { title: ROADMAP_TITLE, deletedAt: null }, deletedAt: null } }),
        prisma.task.findMany({ where: { source: SOURCE, deletedAt: null }, select: { id: true, externalKey: true, checklists: { where: { deletedAt: null }, select: { items: { where: { deletedAt: null }, select: { position: true } } } } } }),
        prisma.event.findMany({ where: { source: SOURCE, deletedAt: null }, select: { externalKey: true } }),
      ]);
      const taskByKey = new Map(tasks.map((task) => [task.externalKey, task]));
      const eventKeys = new Set(events.map((event) => event.externalKey));
      let missingChecklists = 0;
      let missingChecklistItems = 0;
      for (const row of requiredRows) {
        const key = `${SOURCE}:${row["Ngày"]}:${slug(row["Công việc chính"])}`;
        const task = taskByKey.get(key);
        if (!task) continue;
        const checklist = task.checklists[0];
        if (!checklist) { missingChecklists++; continue; }
        const expected = row["Thứ"] === "Thứ Sáu" && /review|mock|chữa lỗi/i.test(`${row["Công việc chính"]} ${row["Chi tiết 120 phút"]}`) ? REVIEW_ITEMS.length : checklistItems(row["Chi tiết 120 phút"]).length;
        missingChecklistItems += Math.max(0, expected - checklist.items.length);
      }
      const result = { newGoals: goals ? 0 : 1, newRoadmaps: roadmaps ? 0 : 1, newStages: Math.max(0, 8 - stages), newTasks: expectedKeys.filter((key) => !taskByKey.has(key)).length, newChecklists: missingChecklists, newChecklistItems: missingChecklistItems, newEvents: expectedKeys.filter((key) => !eventKeys.has(`${key}:event`)).length };
      console.log("Japanese study plan idempotency verification completed");
      console.log(JSON.stringify(result, null, 2));
      if (Object.values(result).some(Boolean)) process.exitCode = 1;
      return;
    } finally {
      await prisma.$disconnect();
    }
  }
  const counts = { goalsCreated: 0, goalsReused: 0, roadmapsCreated: 0, roadmapsReused: 0, stagesCreated: 0, stagesUpdated: 0, tasksCreated: 0, tasksUpdated: 0, checklistsCreated: 0, checklistItemsCreated: 0, checklistItemsUpdated: 0, eventsCreated: 0, eventsUpdated: 0, notesCreated: 0, notesReused: 0, restDaysSkipped: restRows.length };
  try {
    await prisma.$transaction(async (tx) => {
      let user = await tx.user.findFirst({ where: { id: userId, deletedAt: null }, select: { id: true, profile: { select: { timezone: true } } } });
      if (!user) {
        const activeUsers = await tx.user.findMany({ where: { deletedAt: null }, take: 2, select: { id: true, profile: { select: { timezone: true } } } });
        if (activeUsers.length !== 1) throw new Error("Configured import owner does not exist and database does not contain exactly one active user; pass --user-id explicitly.");
        user = activeUsers[0];
        userId = user.id;
      }
      const ownerId = user.id;
      const timezone = user.profile?.timezone || "UTC";
      const candidates = await tx.goal.findMany({ where: { userId: ownerId, deletedAt: null, OR: [{ title: { contains: "Japanese", mode: "insensitive" } }, { title: { contains: "tiếng Nhật", mode: "insensitive" } }, { title: { contains: "JLPT", mode: "insensitive" } }, { title: { contains: "N3", mode: "insensitive" } }] }, orderBy: { updatedAt: "desc" } });
      let goal = candidates.find((item) => item.title === GOAL_TITLE) ?? candidates[0];
      const goalData = { title: GOAL_TITLE, description: "Học tiếng Nhật từ số 0, hoàn thành nền tảng N5 và N4 trước tháng 4/2027, sau đó học và luyện thi N3 để đạt trình độ JLPT N3 vào khoảng tháng 11/2027.", startsAt: dateOnly("2026-08-17"), deadline: dateOnly("2027-11-30", true), status: "ACTIVE" as const, priority: "HIGH" as const, successCriteria: ["Hoàn thành nhập môn: 08/2026", "Hoàn thành N5: 12/2026", "Hoàn thành N4: 04/2027", "Hoàn thành kiến thức N3: 09/2027", "Luyện N3: 10/2027", "Tổng ôn N3: 11/2027"] };
      if (goal) { goal = await tx.goal.update({ where: { id: goal.id }, data: { ...goalData, version: { increment: 1 } } }); counts.goalsReused += 1; }
      else { goal = await tx.goal.create({ data: { ...goalData, userId: ownerId } }); counts.goalsCreated += 1; }

      let roadmap = await tx.roadmap.findFirst({ where: { userId: ownerId, goalId: goal.id, deletedAt: null, OR: [{ title: ROADMAP_TITLE }, { title: { contains: "Japanese", mode: "insensitive" } }, { title: { contains: "N3", mode: "insensitive" } }] } });
      if (roadmap) { roadmap = await tx.roadmap.update({ where: { id: roadmap.id }, data: { title: ROADMAP_TITLE, description: "Lộ trình từ nhập môn qua N5, N4 tới JLPT N3.", version: { increment: 1 } } }); counts.roadmapsReused += 1; }
      else { roadmap = await tx.roadmap.create({ data: { userId: ownerId, goalId: goal.id, title: ROADMAP_TITLE, description: "Lộ trình từ nhập môn qua N5, N4 tới JLPT N3." } }); counts.roadmapsCreated += 1; }

      const stageIds = new Map<string, string>();
      for (const [position, [excelName, definition]] of Object.entries(STAGES).entries()) {
        const existing = await tx.roadmapStage.findFirst({ where: { userId: ownerId, roadmapId: roadmap.id, deletedAt: null, OR: [{ title: definition.title }, { position }] } });
        const data = { title: definition.title, description: definition.description, position, startsAt: dateOnly(definition.startsAt), endsAt: dateOnly(definition.endsAt, true), status: definition.startsAt <= new Date().toISOString().slice(0, 10) && definition.endsAt >= new Date().toISOString().slice(0, 10) ? "ACTIVE" as const : definition.endsAt < new Date().toISOString().slice(0, 10) ? "COMPLETED" as const : "PLANNED" as const, successCriteria: definition.successCriteria };
        const stage = existing ? await tx.roadmapStage.update({ where: { id: existing.id }, data: { ...data, version: { increment: 1 } } }) : await tx.roadmapStage.create({ data: { ...data, userId: ownerId, roadmapId: roadmap.id } });
        if (existing) counts.stagesUpdated++;
        else counts.stagesCreated++;
        stageIds.set(excelName, stage.id);
      }

      for (const row of requiredRows) {
        const taskKey = `${SOURCE}:${row["Ngày"]}:${slug(row["Công việc chính"])}`;
        const taskData = { goalId: goal.id, roadmapId: roadmap.id, roadmapStageId: stageIds.get(row["Giai đoạn"])!, title: row["Công việc chính"], description: row["Chi tiết 120 phút"], status: status(row["Trạng thái"]), priority: "MEDIUM" as const, dueAt: dateAt(row["Ngày"], "23:59", timezone), estimatedMinutes: 120, expectedResult: row["Kết quả cần đạt"] || null, resources: resources(row["Tài liệu"]), source: SOURCE, externalKey: taskKey, isOptional: false };
        const existingTask = await tx.task.findFirst({ where: { userId: ownerId, externalKey: taskKey }, select: { id: true } });
        const task = existingTask ? await tx.task.update({ where: { id: existingTask.id }, data: { ...taskData, version: { increment: 1 } } }) : await tx.task.create({ data: { ...taskData, userId: ownerId, position: 0 } });
        if (existingTask) counts.tasksUpdated++;
        else counts.tasksCreated++;
        const existingChecklist = await tx.checklist.findFirst({ where: { userId: ownerId, taskId: task.id, deletedAt: null }, include: { items: { where: { deletedAt: null }, orderBy: { position: "asc" } } } });
        const checklist = existingChecklist ?? await tx.checklist.create({ data: { userId: ownerId, taskId: task.id, title: `Các bước: ${row["Công việc chính"]}` }, include: { items: true } });
        if (!existingChecklist) counts.checklistsCreated++;
        const isWeeklyReview = row["Thứ"] === "Thứ Sáu" && /review|mock|chữa lỗi/i.test(`${row["Công việc chính"]} ${row["Chi tiết 120 phút"]}`);
        const items = isWeeklyReview ? REVIEW_ITEMS : checklistItems(row["Chi tiết 120 phút"]);
        for (const [position, title] of items.entries()) {
          const existingItem = checklist.items[position];
          if (existingItem) { await tx.checklistItem.update({ where: { id: existingItem.id }, data: { title, position, version: { increment: 1 } } }); counts.checklistItemsUpdated++; }
          else { await tx.checklistItem.create({ data: { userId: ownerId, checklistId: checklist.id, title, position } }); counts.checklistItemsCreated++; }
        }
        if (checklist.items.length > items.length) await tx.checklistItem.updateMany({ where: { checklistId: checklist.id, userId: ownerId, position: { gte: items.length }, deletedAt: null }, data: { deletedAt: new Date(), version: { increment: 1 } } });
        const startsAt = dateAt(row["Ngày"], defaultTime!, timezone);
        const eventKey = `${taskKey}:event`;
        const eventData = { goalId: goal.id, taskId: task.id, title: `🇯🇵 ${row["Công việc chính"]}`, description: null, startsAt, endsAt: new Date(startsAt.getTime() + 120 * 60_000), timezone, recurrence: "NONE" as const, source: SOURCE, externalKey: eventKey };
        const existingEvent = await tx.event.findFirst({ where: { userId: ownerId, externalKey: eventKey }, select: { id: true } });
        if (existingEvent) { await tx.event.update({ where: { id: existingEvent.id }, data: { ...eventData, version: { increment: 1 } } }); counts.eventsUpdated++; }
        else { await tx.event.create({ data: { ...eventData, userId: ownerId } }); counts.eventsCreated++; }
      }

      const reviewRows = requiredRows.filter((row) => /review|mock|chữa lỗi/i.test(`${row["Công việc chính"]} ${row["Chi tiết 120 phút"]}`));
      let errorLog = await tx.note.findFirst({ where: { userId: ownerId, title: "Japanese Learning Error Log", deletedAt: null } });
      const sections = reviewRows.map((row) => `## Week ${row["Tuần"]} - ${row["Ngày"]}\n\n- Vocabulary/Kanji:\n- Grammar:\n- Reading:\n- Listening:\n- Errors to review:\n`).join("\n");
      if (errorLog) { const additions = sections.split("\n## ").map((part, index) => index ? `## ${part}` : part).filter((section) => section.startsWith("## ") && !errorLog!.content.includes(section.split("\n")[0])).join("\n"); if (additions) errorLog = await tx.note.update({ where: { id: errorLog.id }, data: { content: `${errorLog.content.trim()}\n\n${additions}`.trim(), goalId: goal.id, version: { increment: 1 } } }); counts.notesReused++; }
      else { await tx.note.create({ data: { userId: ownerId, goalId: goal.id, title: "Japanese Learning Error Log", content: sections } }); counts.notesCreated++; }
    }, { maxWait: 30_000, timeout: 900_000 });
    console.log("Japanese study plan import completed");
    console.log(JSON.stringify(counts, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Import failed"); process.exitCode = 1; });
