import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { DuplicateEmailException } from '@/core/exceptions/duplicate-email.exception';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from '@/auth/hash';
import { PasswordReusedException } from '@/core/exceptions/password-reused.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const saltRounds = this.configService.get<number>('auth.salt');
      const hash = await hashPassword(createUserDto.password, saltRounds);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
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

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map((x) => plainToInstance(UserDto, x));
  }

  async findOne(id: number, nullCheck = true): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (nullCheck && !user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    if (!user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }

  async remove(id: number): Promise<UserDto> {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async resetPassword(id: number, password: string): Promise<UserDto> {
    const saltRounds = this.configService.get<number>('auth.salt');
    const hash = await hashPassword(password, saltRounds);
    const user = await this.prisma.user.findUnique({ where: { id } });

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
    if (!user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }
}
