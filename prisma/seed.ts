import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const fakerUser = async (quantity: number) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      email: 'admin@nest-template.com',
      role: 'Admin',
      password: await bcrypt.hash('AdminAdmin1!', salt),
      emailVerified: true,
      active: true,
    },
  });

  for (let count = 0; count < quantity; count++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'User',
        password: await bcrypt.hash('TestTest1!', salt),
        emailVerified: faker.datatype.boolean(),
        active: faker.datatype.boolean(),
      },
    });
  }
};

async function main() {
  dotenv.config();

  await fakerUser(5);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
