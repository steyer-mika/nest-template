import { type Prisma, type PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

export default async (prisma: PrismaClient, quantity: number) => {
  dotenv.config();

  const users: Prisma.UserCreateInput[] = [];
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT || '10'));

  users.push({
    email: 'admin@nest-template.com',
    role: 'Admin',
    username: 'Admin',
    password: await bcrypt.hash('AdminAdmin1!', salt),
    emailVerified: true,
    active: true,
  });

  for (let count = 0; count < quantity; count++) {
    users.push({
      email: `user-${count + 1}@nest-template.com`,
      username: `User ${count + 1}`,
      role: 'User',
      password: await bcrypt.hash('TestTest1!', salt),
      emailVerified: true,
      active: true,
    });
  }

  return prisma.user.createMany({ data: users });
};
