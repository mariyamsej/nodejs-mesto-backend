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

  // return User.find({})
  //   .then(users => {
  //     res.send({ data: users})
  //     return;
  //   })
  //   .catch(err => {
  //     res.status(500).send( {message: 'Error retrieving users' + err.message })
  //     return;
  //   });
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

  // User.findById(userId)
  // .then(user => {
  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }
  //   res.status(200).json(user);
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Error retrieving user: ' + err.message });
  // });

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

  // User.create({ name, about, avatar })
  //   .then(user => {
  //     res.status(201).send({ data: user });
  //     return;
  //   })
  //   .catch(err => {
  //     console.error('Ошибка создания юзера:', err);
  //     res.status(500).send({ message: 'Произошла ошибка' });
  //     return;
  //   });
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.body.user._id;

  console.log(userId);

  /* User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'Пользователь не найден' });
      }
        res.send({ data: user });
      })
      .catch((err) => {
        res.status(500).send({ message: `Ошибка при обновлении профиля: ${err.message}` });
      }); */

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

  // User.findByIdAndUpdate(
  //   userId,
  //   { avatar },
  //   { new: true, runValidators: true }
  // )
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send({ message: 'Пользователь не найден' });
  //     }
  //     res.send({ data: user });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: `Ошибка при обновлении аватара: ${err.message}` });
  //   });
};
