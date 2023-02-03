import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail()
  readonly email: string;
}
