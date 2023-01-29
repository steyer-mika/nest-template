import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MongoError } from 'mongodb';

import { DuplicateEmailException } from '@core/exceptions/duplicate-email.exception';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const saltRounds = this.configService.get<number>('auth.salt');

    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(createUserDto.password, salt);

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

  async find(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((x) => plainToInstance(UserDto, x));
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
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

  async getUserById(id: string): Promise<UserDto | undefined> {
    const user = await this.userModel.findById(id).exec();
    return plainToInstance(UserDto, user);
  }
}
