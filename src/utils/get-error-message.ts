import { GENERIC_ERROR_MESSAGE } from '@/common/constants/generic-error-message';

export function getErrorMessage(error: unknown): string {
  return (error as { message?: string })?.message ?? GENERIC_ERROR_MESSAGE;
}
