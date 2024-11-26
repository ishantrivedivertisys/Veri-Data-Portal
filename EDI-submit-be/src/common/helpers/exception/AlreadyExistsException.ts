import { HttpStatus } from '@nestjs/common';
import { Exception } from './Exception';

export class AlreadyExistsException extends Exception {
  constructor(message?: string) {
    super(
      message ?? 'Already Exists',
      HttpStatus.CONFLICT,
      'https://httpstatuses.com/409',
      undefined,
      undefined,
      undefined,
    );
  }
}
