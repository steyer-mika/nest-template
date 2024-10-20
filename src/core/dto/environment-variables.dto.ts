import { Environment } from '@/config/environment';
import { IsStringOrNumber } from '@/core/decorators/validation/isStringOrNumber';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class EnvironmentVariablesDto {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty()
  @IsString()
  APP_NAME: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsNumber()
  @Min(0)
  SALT: number;

  @IsNotEmpty()
  @IsStringOrNumber()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsStringOrNumber()
  JWT_EXPIRES_IN: string | number;

  @IsNotEmpty()
  @IsStringOrNumber()
  JWT_REFRESH_EXPIRES_IN: string | number;

  @IsNotEmpty()
  @IsStringOrNumber()
  JWT_CONFIRMATION_EXPIRES_IN: string | number;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  MAILJET_API_KEY_PUBLIC: string;

  @IsNotEmpty()
  @IsString()
  MAILJET_API_KEY_PRIVATE: string;
}
