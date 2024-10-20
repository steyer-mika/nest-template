import { Injectable, UnauthorizedException } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { hashPassword } from '@/auth/hash';
import { DuplicateEmailException } from '@/core/exceptions/duplicate-email.exception';
import { PasswordReusedException } from '@/core/exceptions/password-reused.exception';
import { type PrismaService } from '@/services/prisma/prisma.service';

import { type CreateUserDto } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new user.
   * @param createUserDto - Data for creating a new user.
   * @returns A promise that resolves to a UserDto.
   */
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const saltRounds = this.configService.getOrThrow<number>('auth.salt');
      const hash = await hashPassword(createUserDto.password, saltRounds);

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          role: 'User',
          isActive: true,
          isEmailVerified: false,
          password: hash,
        },
      });

      return plainToInstance(UserDto, user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new DuplicateEmailException();
      }

      throw error;
    }
  }

  /**
   * Find a user by ID.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to a UserDto.
   */
  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(UserDto, user);
  }

  /**
   * Update a user's information.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data for updating the user.
   * @returns A promise that resolves to a UserDto.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return plainToInstance(UserDto, user);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A string indicating the success of the deletion.
   */
  async delete(id: number): Promise<string> {
    const user = await this.prisma.user.delete({ where: { id } });

    return `User with id ${user.id} has been deleted successfully.`;
  }

  /**
   * Reset a user's password.
   * @param id - The ID of the user to reset the password for.
   * @param password - The new password.
   * @returns A promise that resolves to a UserDto.
   */
  async resetPassword(id: number, password: string): Promise<UserDto> {
    const saltRounds = this.configService.getOrThrow<number>('auth.salt');
    const hash = await hashPassword(password, saltRounds);

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (
      user === null ||
      user.isActive === false ||
      user.isEmailVerified === false
    ) {
      throw new UnauthorizedException();
    }

    if (user.password === hash) throw new PasswordReusedException();

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hash,
      },
    });

    return plainToInstance(UserDto, user);
  }

  /**
   * Verify a user's email.
   * @param id - The ID of the user to verify the email for.
   * @returns A promise that resolves to a UserDto.
   */
  async verifyEmail(id: number): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isEmailVerified: true },
    });

    return plainToInstance(UserDto, user);
  }

  /**
   * Check if a user can perform an action.
   * @param action - The action the user is attempting to perform.
   * @param subjectId - The ID of the subject of the action.
   * @param authUser - The authenticated user.
   * @returns A boolean indicating if the user can perform the action.
   */
  $can(subjectId: number, authUser: UserDto): boolean {
    if (authUser.role === 'Admin') return true;

    return authUser.id === subjectId;
  }
}
