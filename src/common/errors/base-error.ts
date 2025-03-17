import { HttpStatusCode } from '../constants/http-status-code';

export class BaseError extends Error {
  readonly code: number;

  constructor(
    message: string,
    code: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}
