import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorised-error';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  // console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-token') as { _id: string };
    req.user = payload;
    next();
    return;
  } catch {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  // req.user = payload;

  // next();
};
