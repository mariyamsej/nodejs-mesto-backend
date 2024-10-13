export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_BAD_REQUEST = 400;

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}
