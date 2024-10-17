export const HTTP_STATUS_NOT_FOUND = 404;

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}
