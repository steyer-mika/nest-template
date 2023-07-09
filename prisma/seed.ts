import { PrismaClient } from '@prisma/client';

import userSeed from './seeds/user.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    // delete all tables
    await prisma.user.deleteMany({});

    // seed user table
    await userSeed(prisma, 5);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
