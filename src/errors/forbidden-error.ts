export const HTTP_STATUS_ACCESS_FORBIDDEN = 403;

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_ACCESS_FORBIDDEN;
  }
}
