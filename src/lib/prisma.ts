import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/env/server";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaClient: PrismaClient | undefined;

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
  return new PrismaClient({ adapter });
}

export function getPrisma() {
  const prisma = globalForPrisma.prisma ?? prismaClient ?? createPrismaClient();
  prismaClient = prisma;

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
