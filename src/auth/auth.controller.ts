import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { User } from '@prisma/client';
import { Public } from '@auth/decorators/public.decorator';
import { GetUser } from '@core/decorators/param/user.decorator';
import { TokenDto } from '@/auth/dto/token.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { type JwtAuthResponse } from './jwt/types';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async me(@GetUser() user: User): Promise<User> {
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
  async login(@GetUser() user: User): Promise<JwtAuthResponse> {
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@GetUser() user: User): Promise<JwtAuthResponse> {
    return this.authService.login(user);
  }

  @Get('email/email-verification')
  async sendEmailVerification(@GetUser() user: User): Promise<string> {
    return this.authService.sendEmailVerification(user);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() tokenDto: TokenDto): Promise<JwtAuthResponse> {
    return this.authService.verifyEmail(tokenDto.token);
  }

  @Public()
  @Post('email/reset-password')
  async sendResetPasswordEmail(@Body() emailDto: EmailDto): Promise<string> {
    return this.authService.sendResetPassword(emailDto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<JwtAuthResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
