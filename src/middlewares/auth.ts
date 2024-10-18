import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UnauthorizedError } from '../errors/unauthorised-error';

dotenv.config();

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  // console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
    req.user = payload;
    next();
    return;
  } catch {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  // req.user = payload;

  // next();
};
