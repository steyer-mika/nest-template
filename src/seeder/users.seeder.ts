import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder, DataFactory, FactoryValue } from 'nestjs-seeder';

import { User, UserDocument } from '@api/users/schemas/user.schema';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}

  async seed(): Promise<UserDocument[]> {
    const users = DataFactory.createForClass(User).generate(10);

    return this.usersModel.insertMany<Record<string, FactoryValue>[]>(users);
  }

  async drop(): Promise<unknown> {
    return this.usersModel.deleteMany();
  }
}
