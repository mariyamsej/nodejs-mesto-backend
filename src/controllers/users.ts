import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/users';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { UnauthorizedError } from '../errors/unauthorised-error';

dotenv.config();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const userId = req.user._id;

    const user = await User.findById(userId);

    res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  // console.log(userId);

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Некорректный id пользователя');
    }

    const user = await User.findById(userId).orFail(() => new NotFoundError('Пользователь с данным id не найден'));

    res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  try {
    if (!email || !password) {
      throw new BadRequestError('Email и пароль обязательны');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });

    res.status(201).send({
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для создания пользователя'));
    } else {
      next(err);
    }
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  // console.log(userId);

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    user.avatar = avatar || user.avatar;

    await user.save();

    res.send({ data: user });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      console.log(err);
      next(new BadRequestError('Некорректный формат ссылки'));
    } else {
      next(err);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    // console.log(user);

    console.log(process.env.JWT_SECRET);

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ message: 'Успешный вход!' });
  } catch (err) {
    // console.log(err);
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }
};
