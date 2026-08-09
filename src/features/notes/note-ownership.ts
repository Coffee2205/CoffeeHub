export function noteOwnerWhere(userId: string, id: string) {
  return { id, userId, deletedAt: null } as const;
}
