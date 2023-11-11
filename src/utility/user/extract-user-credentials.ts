import { type UserDto } from '@/api/user/dto/user.dto';

export const extractUserCredentials = (user: UserDto): string => {
  if (user.firstname && user.lastname) {
    return `${user.firstname} ${user.lastname}`;
  }

  return user.username;
};
