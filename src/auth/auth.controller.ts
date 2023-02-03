import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { UserDto } from '@api/users/dto/user.dto';
import { Public } from '@auth/decorators/public.decorator';
import { User } from '@core/decorators/param/user.decorator';
import { TokenDto } from '@/auth/dto/token.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthResponse } from './jwt/types';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@ApiBearerAuth()
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

  @Get('email/email-verification')
  async sendEmailVerification(@User() user: UserDto): Promise<string> {
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
