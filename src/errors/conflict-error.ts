export const HTTP_STATUS_CONFLICT = 409;

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}
