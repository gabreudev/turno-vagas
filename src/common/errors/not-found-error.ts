import { HttpStatusCode } from '../constants/http-status-code';
import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  constructor(entity: string, name: string, value: string) {
    super(
      `${entity} with ${name} ${value} not found`,
      HttpStatusCode.NOT_FOUND,
    );
  }
}
