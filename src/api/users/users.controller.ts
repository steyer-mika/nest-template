import { Controller, Body, Get, Patch, Delete } from '@nestjs/common';

import { Action } from '@auth/casl/actions';
import { AppAbility } from '@auth/casl/casl-ability.factory';
import { CheckPolicies } from '@auth/decorators/polices.decorator';
import { Id } from 'src/core/decorators/param/id.decorator';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  async find(@Id() id: string): Promise<UserDto> {
    return this.usersService.find(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  async update(
    @Id() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  async delete(@Id() id: string): Promise<string> {
    return this.usersService.delete(id);
  }
}
