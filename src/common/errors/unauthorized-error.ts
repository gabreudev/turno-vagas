import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(`Unauthorized: ${message}`, 401);
  }
}
