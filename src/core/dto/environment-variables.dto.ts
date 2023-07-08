import {
  IsEnum,
  IsNumber,
  Min,
  IsString,
  IsUrl,
  IsEmail,
  Max,
} from 'class-validator';
import { IsStringOrNumber } from '@core/decorators/validation/isStringOrNumber';

enum Environment {
  development = 'development',
  production = 'production',
  staging = 'staging',
}

export class EnvironmentVariablesDto {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  APP_NAME: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsNumber()
  @Min(0)
  SALT: number;

  @IsStringOrNumber()
  JWT_SECRET: string;

  @IsStringOrNumber()
  JWT_EXPIRES_IN: string | number;

  @IsStringOrNumber()
  JWT_REFRESH_EXPIRES_IN: string | number;

  @IsStringOrNumber()
  JWT_CONFIRMATION_EXPIRES_IN: string | number;

  @IsStringOrNumber()
  JWT_RESET_PASSWORD_EXPIRES_IN: string | number;

  @IsString()
  @IsUrl({
    protocols: ['postgresql'],
    require_tld: false,
  })
  DATABASE_URL: string;

  @IsString()
  @IsUrl({
    require_tld: false,
  })
  FRONTEND_URL: string;

  @IsString()
  SMTP_HOST: string;

  @IsEmail()
  SMTP_USER: string;

  @IsString()
  SMTP_PASSWORD: string;

  @IsEmail()
  SMTP_DEFAULT: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  SMTP_PORT: number;

  @IsNumber()
  @Min(0)
  THROTTLER_TTL: number;

  @IsNumber()
  @Min(0)
  THROTTLER_LIMIT: number;

  @IsNumber()
  @Min(0)
  CACHE_TTL: number;

  @IsNumber()
  @Min(0)
  CACHE_MAX: number;
}
