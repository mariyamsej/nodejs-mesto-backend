import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.body.user = {
//     _id: '670ac3c44bd3f4df49691fab' // _id пользователя
//   };

//   console.log(req.body);

//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(userRoutes);
app.use(cardRoutes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
