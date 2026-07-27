export function calculateProgress(statuses: readonly string[]) {
  const total = statuses.length;
  const completed = statuses.filter((status) => status === "COMPLETED").length;
  return { completed, total, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
}
