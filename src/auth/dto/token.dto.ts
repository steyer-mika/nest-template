import { IsJWT } from 'class-validator';

export class TokenDto {
  @IsJWT()
  readonly token: string;
}
