import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Strategy } from 'passport-local';

import { UserDto } from '@/api/user/dto/user.dto';
import { type AuthService } from '@/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserDto> {
    const user = await this.authService.validateUser(email, password);

    if (!user || user.isActive !== true) {
      throw new UnauthorizedException();
    }

    return plainToInstance(UserDto, user);
  }
}
