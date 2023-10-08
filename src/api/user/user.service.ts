import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import { PasswordReusedException } from '@/core/exceptions/password-reused.exception';
import { DuplicateEmailException } from '@/core/exceptions/duplicate-email.exception';
import { PrismaService } from '@/services/prisma/prisma.service';
import { hashPassword } from '@/auth/hash';

import { type CreateUserDto } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const saltRounds = this.configService.getOrThrow<number>('auth.salt');
      const hash = await hashPassword(createUserDto.password, saltRounds);
      return this.prisma.user.create({
        data: {
          ...createUserDto,
          active: true,
          emailVerified: false,
          role: 'User',
          password: hash,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new DuplicateEmailException();
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async resetPassword(id: number, password: string): Promise<User> {
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

    return user;
  }

  async verifyEmail(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
  }
}
