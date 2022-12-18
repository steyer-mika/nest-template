import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';

import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { UserDto } from '@api/users/dto/user.dto';
import { Public } from '@auth/decorators/public.decorator';
import { User } from 'src/core/decorators/param/user.decorator';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthResponse } from './jwt/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  async me(@User() user: UserDto): Promise<UserDto> {
    return user;
  }

  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<JwtAuthResponse> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserDto): Promise<JwtAuthResponse> {
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@User() user: UserDto): Promise<JwtAuthResponse> {
    return this.authService.login(user);
  }
}
