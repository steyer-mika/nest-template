import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

export default async (prisma: PrismaClient, quantity: number) => {
  dotenv.config();

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
