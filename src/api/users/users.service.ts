import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { DuplicateEmailException } from '@/core/exceptions/duplicate-email.exception';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from '@/auth/hash';
import { PasswordReusedException } from '@/core/exceptions/password-reused.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const saltRounds = this.configService.get<number>('auth.salt');
      const hash = await hashPassword(createUserDto.password, saltRounds);
      return this.prisma.user.create({
        data: {
          ...createUserDto,
          active: true,
          emailVerified: false,
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

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  async resetPassword(id: number, password: string): Promise<User> {
    const saltRounds = this.configService.get<number>('auth.salt');
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
    const user = await this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
    if (!user) throw new NotFoundException();
    return user;
  }
}
