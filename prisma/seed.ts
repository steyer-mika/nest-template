import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import userSeeder from './seeds/user.seeder';

const prisma = new PrismaClient();

const main = async () => {
  try {
    // seed user table
    await userSeeder(prisma, 5);
  } catch (error) {
    Logger.error(error, 'Seeder');
  } finally {
    await prisma.$disconnect();
  }
};

main();
