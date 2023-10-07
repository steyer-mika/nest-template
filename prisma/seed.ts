import { PrismaClient } from '@prisma/client';

import userSeeder from './seeds/user.seeder';

const prisma = new PrismaClient();

const main = async () => {
  try {
    // delete all tables
    await prisma.user.deleteMany({});

    // seed user table
    await userSeeder(prisma, 5);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
