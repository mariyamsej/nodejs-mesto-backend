import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { errors } from 'celebrate';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/errorHandler';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';

import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { login, createUser } from './controllers/users';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// mongoose.connect('mongodb://localhost:27017/mestodb');
mongoose.connect(process.env.MONGO_URL as string);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(userRoutes);
app.use(cardRoutes);

app.use(errorLogger);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
  // res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
