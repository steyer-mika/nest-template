import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const fakerUsers = async (quantity: number) => {
  const users: Prisma.UserCreateInput[] = [];
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));

  users.push({
    email: 'admin@nest-template.com',
    role: 'Admin',
    password: await bcrypt.hash('AdminAdmin1!', salt),
    emailVerified: true,
    active: true,
  });

  for (let count = 0; count < quantity; count++) {
    users.push({
      email: faker.internet.email(),
      role: 'User',
      password: await bcrypt.hash('TestTest1!', salt),
      emailVerified: faker.datatype.boolean(),
      active: faker.datatype.boolean(),
    });
  }

  return prisma.user.createMany({ data: users });
};

async function main() {
  dotenv.config();

  // Remove Data //
  await prisma.user.deleteMany({});

  // Fake Users
  await fakerUsers(5);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
