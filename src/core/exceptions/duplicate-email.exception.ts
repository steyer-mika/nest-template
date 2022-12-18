import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateEmailException extends HttpException {
  constructor() {
    super('User with this Email already exists.', HttpStatus.CONFLICT);
  }
}
