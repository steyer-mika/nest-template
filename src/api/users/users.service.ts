import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { MongoError } from 'mongodb';

import { DuplicateEmailException } from '@core/exceptions/duplicate-email.exception';
import { PasswordReusedException } from '@/core/exceptions/password-reused.exception';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from './utility';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const hash = await hashPassword(createUserDto.password);

      const createdUser = await this.userModel.create({
        ...createUserDto,
        password: hash,
      });

      return plainToInstance(UserDto, createdUser);
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        throw new DuplicateEmailException();
      }
      throw new InternalServerErrorException();
    }
  }

  async find(id: string, nullCheck = true): Promise<UserDto> {
    const user = await this.userModel.findById(id).exec();
    if (nullCheck && !user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((x) => plainToInstance(UserDto, x));
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto | { emailVerified: boolean },
  ): Promise<UserDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );
    return plainToInstance(UserDto, updatedUser);
  }

  async delete(id: string): Promise<string> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException();
    return `User with id ${deletedUser.id} has been deleted successfully.`;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async resetPassword(id: string, password: string): Promise<UserDto> {
    const hash = await hashPassword(password);
    const user = await this.userModel.findById(id);

    if (user.password === hash) throw new PasswordReusedException();

    user.password = hash;
    await user.save();

    return plainToInstance(UserDto, user);
  }
}
