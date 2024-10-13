import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { errorHandler } from '../middlewares/errorHandler';
import userRoutes from '../routes/users';
import cardRoutes from '../routes/cards';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.body.user = {
    _id: '670ac3c44bd3f4df49691fab' // _id пользователя
  };

  console.log(req.body);

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
