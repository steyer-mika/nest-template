import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Authorization } from '@/core/compositions/authorization.decorator';
import { AuthUser } from '@/core/decorators/param/user.decorator';

import { type CreateUserDto } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';
import { type UserDto } from './dto/user.dto';
import { UserService } from './user.service';

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
  @Authorization('create', 'User')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(createUserDto);
  }

  /**
   * Get a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to a UserDto.
   */
  @Get(':id')
  @Authorization('read', 'User')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserDto,
  ): Promise<UserDto> {
    // Ensure the user is updating their own information.
    if (this.userService.$can(id, user) === false) {
      throw new UnauthorizedException();
    }

    return this.userService.findOne(id);
  }

  /**
   * Update a user's information.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data for updating the user.
   * @returns A promise that resolves to a UserDto.
   */
  @Patch(':id')
  @Authorization('update', 'User')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: UserDto,
  ): Promise<UserDto> {
    // Ensure the user is updating their own information.
    if (this.userService.$can(id, user) === false) {
      throw new UnauthorizedException();
    }

    return this.userService.update(id, updateUserDto);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A string indicating the success of the deletion.
   */
  @Delete(':id')
  @Authorization('delete', 'User')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserDto,
  ): Promise<string> {
    // Ensure the user is updating their own information.
    if (this.userService.$can(id, user) === false) {
      throw new UnauthorizedException();
    }

    return this.userService.delete(id);
  }
}
