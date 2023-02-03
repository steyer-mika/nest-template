import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordReusedException extends HttpException {
  constructor() {
    super('The new password can not be the old password.', HttpStatus.CONFLICT);
  }
}
