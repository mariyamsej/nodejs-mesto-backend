import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import { NotFoundError } from '../errors/not-found-error';

interface IUser {
  email: string,
  password: string,
  name: string;
  about: string;
  avatar: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный формат email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле password обязательно'],
      select: false,
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],

    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [300, 'Максимальная длина поля "about" - 300'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v: string) => /^(https?:\/\/)(www\.)?[\w.-]+\.[a-z]{2,6}([\/\w .-]*)*\/?$/.test(v),
        message: 'Некорректный формат ссылки',
      },
    },
  },
  {
    versionKey: false,
  },
);

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string, next: NextFunction) {
  try {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      throw new NotFoundError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new NotFoundError('Неправильные почта или пароль');
    }

    return user;
  } catch (err) {
    next(err);
  }
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
