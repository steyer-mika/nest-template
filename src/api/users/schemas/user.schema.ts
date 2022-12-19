import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Roles } from '@auth/roles';
import * as bcrypt from 'bcrypt';
import { Factory } from 'nestjs-seeder';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Factory((faker) => faker.internet.userName())
  @Prop({ required: true })
  username: string;

  @Factory((faker) => faker.internet.email())
  @Prop({ required: true, unique: true })
  email: string;

  @Factory((faker) => faker.helpers.arrayElement(Object.values(Roles)))
  @Prop({ required: true, enum: Roles })
  role: Roles;

  @Factory(() => bcrypt.hashSync('TestTest1!', bcrypt.genSaltSync(10)))
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
