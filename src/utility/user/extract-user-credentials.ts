import { type UserDto } from '@/api/user/dto/user.dto';

/**
 * Extract user credentials
 * @param user User
 * @returns User credentials
 */
export const extractUserCredentials = (user: UserDto): string => {
  if (user.firstname && user.lastname) {
    return `${user.firstname} ${user.lastname}`;
  }

  return user.username;
};
