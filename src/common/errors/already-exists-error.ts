import { HttpStatusCode } from '../constants/http-status-code';
import { BaseError } from './base-error';

export class AlreadyExistsError extends BaseError {
  constructor(entity: string, name: string, value: string) {
    super(
      `${entity} with ${name} ${value} already exists`,
      HttpStatusCode.CONFLICT,
    );
  }
}
