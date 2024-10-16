import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/errors';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-token');

    // req.body.user = payload;

    // next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.body.user = payload;

  next();
};
