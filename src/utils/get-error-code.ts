import { HttpStatusCode } from '@/common/constants/http-status-code';

export function getErrorCode(error: unknown): number {
  return (
    (error as { code?: number })?.code ?? HttpStatusCode.INTERNAL_SERVER_ERROR
  );
}
