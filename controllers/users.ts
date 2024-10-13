import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import mongoose from 'mongoose';
import { NotFoundError, BadRequestError } from '../errors/errors';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
    return;
  } catch (err) {
    return next(err);
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
  const { name, about, avatar } = req.body;

  try {
    if (!name || !about  ||!avatar) {
      throw new BadRequestError('Не переданы все необходимые данные');
    }

    // if (!mongoose.Types.string.isValid(avatar)) {
    //   throw new BadRequestError('Некорректный формат аватара');
    // }

    const user = await User.create({ name, about, avatar });
    res.status(201).send({ data: user });
    return;
  } catch (err) {
    console.error('Ошибка создания юзера:', err);
    return next(err);
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
