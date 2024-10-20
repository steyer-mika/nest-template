import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { type CreateUserDto } from '@/api/user/dto/create-user.dto';
import { type UserDto } from '@/api/user/dto/user.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { type TokenDto } from '@/auth/dto/token.dto';
import { AuthUser } from '@/core/decorators/param/user.decorator';

import { AuthService } from './auth.service';
import { type EmailDto } from './dto/email.dto';
import { type ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { type JwtAuthResponse } from './jwt/types';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Get the current user's information.
   * @param user - The authenticated user.
   * @returns A promise that resolves to the user's information.
   */
  @Get('me')
  async me(@AuthUser() user: UserDto): Promise<UserDto> {
    return user;
  }

  /**
   * Register a new user.
   * @param createUserDto - Data for creating a new user.
   * @returns A promise that resolves to a JWT authentication response.
   */
  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<JwtAuthResponse> {
    return this.authService.register(createUserDto);
  }

  /**
   * Login a user using their credentials.
   * @param user - The authenticated user.
   * @returns A promise that resolves to a JWT authentication response.
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@AuthUser() user: UserDto): Promise<JwtAuthResponse> {
    return this.authService.login(user);
  }

  /**
   * Refresh a user's access token.
   * @param user - The authenticated user.
   * @returns A promise that resolves to a JWT authentication response.
   */
  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@AuthUser() user: UserDto): Promise<JwtAuthResponse> {
    return this.authService.login(user);
  }

  /**
   * Send an email verification request.
   * @param user - The authenticated user.
   * @returns A string indicating the success of the email verification request.
   */
  @Get('email/email-verification')
  async sendEmailVerification(@AuthUser() user: UserDto): Promise<string> {
    return this.authService.sendEmailVerification(user);
  }

  /**
   * Verify a user's email using a token.
   * @param tokenDto - Data containing the email verification token.
   * @returns A promise that resolves to a JWT authentication response.
   */
  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() tokenDto: TokenDto): Promise<JwtAuthResponse> {
    return this.authService.verifyEmail(tokenDto.token);
  }

  /**
   * Send an email for resetting the user's password.
   * @param emailDto - Data containing the user's email for password reset.
   * @returns A string indicating the success of the email reset request.
   */
  @Public()
  @Post('email/reset-password')
  async sendResetPasswordEmail(@Body() emailDto: EmailDto): Promise<string> {
    return this.authService.sendResetPassword(emailDto);
  }

  /**
   * Reset a user's password using a token.
   * @param resetPasswordDto - Data containing the password reset token and new password.
   * @returns A promise that resolves to a JWT authentication response.
   */
  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<JwtAuthResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
