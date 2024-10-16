import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../errors/errors';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
    return;
  } catch (err) {
    return next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.user._id;

    console.log("******");

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Некорректный id пользователя');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь с данным id не найден');
    }

    res.status(200).send({ data: user });
    return;
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, about, avatar } = req.body;

  try {
    if (!email || !password) {
      throw new BadRequestError('Email и пароль обязательны');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword, name, about, avatar });
    res.status(201).send({
      data: {
        _id: user._id,
        email: user.email,
        password: user.password,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
    return;
  } catch (err) {
    // console.log(err);
    if (err instanceof Error && err.name == 'ValidationError') {
      console.log(err);
      next(new BadRequestError('Переданы некорректные данные для создания пользователя'));
    }
    else {
      next(err);
  }
    // console.error('Ошибка создания юзера:', err);
    // return next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.body.user._id;

  console.log(userId);

  try {
    if (!name || !about) {
      throw new BadRequestError('Не переданы все необходимые данные');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Некорректный id пользователя');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send({ data: user });
    return;
  } catch (err) {
    return next(err);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.body.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Некорректный id пользователя');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send({ data: user });
    return;
  } catch (err) {
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // const user = await User.findOne ({ email })

    // if (!user) {
    //   throw new NotFoundError('Пользователь с данным id не найден');
    // }

    const user = await User.findUserByCredentials(email, password);

    console.log(user);

    const token = jwt.sign(
      { _id: user._id },
      'secret-token', // Используйте безопасный секрет в переменных окружения (например, process.env.JWT_SECRET)
      { expiresIn: '7d' }
    );

    res
      .cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ message: 'Успешный вход' }); //token
  } catch (err) {
    console.log(err);
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }
};
