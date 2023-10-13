import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Authorization } from '@/core/compositions/authorization.decorator';

import { UserService } from './user.service';
import { type UserDto } from './dto/user.dto';
import { type CreateUserDto } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user.
   * @param createUserDto - Data for creating a new user.
   * @returns A promise that resolves to a UserDto.
   */
  @Post()
  @Authorization('Create', 'User')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(createUserDto);
  }

  /**
   * Get a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to a UserDto.
   */
  @Get(':id')
  @Authorization('Read', 'User')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  /**
   * Update a user's information.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data for updating the user.
   * @returns A promise that resolves to a UserDto.
   */
  @Patch(':id')
  @Authorization('Update', 'User')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A string indicating the success of the deletion.
   */
  @Delete(':id')
  @Authorization('Delete', 'User')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.userService.delete(id);
  }
}
