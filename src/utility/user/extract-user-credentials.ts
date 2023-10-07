import { type User } from '@prisma/client';

export const extractUserCredentials = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.username;
};
