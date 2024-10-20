import { OmitType } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password']) {
  @IsBoolean()
  readonly isActive: boolean;
}
