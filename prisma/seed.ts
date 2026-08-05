import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const userId = process.env.SEED_USER_ID;
const databaseUrl = process.env.DATABASE_URL;

if (!userId || !databaseUrl) {
  throw new Error(
    "SEED_USER_ID and DATABASE_URL are required; seed was not run.",
  );
}

const seedUserId: string = userId;
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { id: seedUserId },
      update: {},
      create: { id: seedUserId },
    });
    await tx.profile.upsert({
      where: { userId: seedUserId },
      update: {},
      create: { userId: seedUserId, displayName: "CoffeeHub Demo" },
    });
    const existingGoal = await tx.goal.findFirst({
      where: { userId: seedUserId, title: "Khám phá CoffeeHub" },
    });
    if (!existingGoal) {
      await tx.goal.create({
        data: {
          userId: seedUserId,
          title: "Khám phá CoffeeHub",
          description:
            "Dữ liệu demo tổng quát, không chứa thông tin cá nhân thật.",
        },
      });
    }
  });
}

main()
  .catch((error: unknown) => {
    console.error(
      "Seed failed without printing credentials.",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
