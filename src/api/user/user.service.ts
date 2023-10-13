import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

import { PasswordReusedException } from '@/core/exceptions/password-reused.exception';
import { DuplicateEmailException } from '@/core/exceptions/duplicate-email.exception';
import { PrismaService } from '@/services/prisma/prisma.service';
import { hashPassword } from '@/auth/hash';

import { UserDto } from './dto/user.dto';
import { type CreateUserDto } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const saltRounds = this.configService.getOrThrow<number>('auth.salt');
      const hash = await hashPassword(createUserDto.password, saltRounds);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          role: 'User',
          active: true,
          emailVerified: false,
          password: hash,
        },
      });

      return plainToInstance(UserDto, user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new DuplicateEmailException();
      }

      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(UserDto, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return plainToInstance(UserDto, user);
  }

  async delete(id: number): Promise<string> {
    const user = await this.prisma.user.delete({ where: { id } });

    return `User with id ${user.id} has been deleted successfully.`;
  }

  async resetPassword(id: number, password: string): Promise<UserDto> {
    const saltRounds = this.configService.getOrThrow<number>('auth.salt');
    const hash = await hashPassword(password, saltRounds);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    if (user.password === hash) throw new PasswordReusedException();

    this.prisma.user.update({
      where: { id },
      data: {
        password: hash,
      },
    });

    return plainToInstance(UserDto, user);
  }

  async verifyEmail(id: number): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });

    return plainToInstance(UserDto, user);
  }
}
