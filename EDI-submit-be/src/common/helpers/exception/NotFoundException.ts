import { HttpStatus } from '@nestjs/common';
import { Exception } from './Exception';

export class NotFoundException extends Exception {
  constructor(message?: string) {
    super(
      message ?? 'Not Found',
      HttpStatus.NOT_FOUND,
      'https://httpstatuses.com/404',
      undefined,
      undefined,
      undefined,
    );
  }
}
