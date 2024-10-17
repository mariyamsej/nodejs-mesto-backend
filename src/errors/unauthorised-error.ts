export const HTTP_STATUS_UNATHORISED_USER = 401;

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_UNATHORISED_USER;
  }
}
