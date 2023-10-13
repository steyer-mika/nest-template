import { type UserDto } from '@/api/user/dto/user.dto';

export const extractUserCredentials = (user: UserDto): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.username;
};
