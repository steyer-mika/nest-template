import { PrismaClient } from '@prisma/client';

import userSeed from './seeds/user.seed';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});
  await userSeed(prisma, 5);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
