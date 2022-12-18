import { Controller, Body, Get, Patch, Delete } from '@nestjs/common';

import { Id } from 'src/core/decorators/param/id.decorator';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { Authorization } from '@/core/compositions/authorization.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Authorization('Read', User)
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Authorization('Read', User)
  async find(@Id() id: string): Promise<UserDto> {
    return this.usersService.find(id);
  }

  @Patch(':id')
  @Authorization('Update', User)
  async update(
    @Id() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Authorization('Delete', User)
  async delete(@Id() id: string): Promise<string> {
    return this.usersService.delete(id);
  }
}
