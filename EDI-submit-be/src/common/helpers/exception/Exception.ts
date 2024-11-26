/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus } from '@nestjs/common';

export class Exception extends Error {
  constructor(
    public readonly title: string,
    public readonly status?: HttpStatus,
    public readonly type?: string,
    public readonly detail?: string,
    public readonly instance?: string,
    public readonly extensions?: Record<
      string,
      string | number | boolean | object | Array<any>
    >,
  ) {
    super(title);
  }
}
