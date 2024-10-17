import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import { HTTP_STATUS_BAD_REQUEST } from '../errors/bad-request-error';
import { HTTP_STATUS_CONFLICT } from '../errors/conflict-error';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) {
    const celebrateError = err.details.get('body') || err.details.get('params')
                          || err.details.get('query') || err.details.get('headers');

    res.status(HTTP_STATUS_BAD_REQUEST).send({
      message: celebrateError?.message || 'Ошибка валидации',
    });
  }

  if (err.code === 11000) {
    res.status(HTTP_STATUS_CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
  }

  // Общая обработка ошибок
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
};
