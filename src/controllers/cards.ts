import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/cards';
import { ForbiddenError } from '../errors/forbidden-error';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { UnauthorizedError } from '../errors/unauthorised-error';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});

    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  if (!req.user) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const ownerId = req.user._id;

  // console.log(req.user._id);
  // console.log(name, link);

  try {
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send({ data: card });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      console.log(err);
      next(new BadRequestError('Переданы некорректные данные для создания карточки пользователя'));
    } else {
      next(err);
    }
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  if (!req.user) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const userId = req.user._id;
  console.log(req.params);

  try {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Некорректный id карточки');
    }

    const card = await Card.findById(cardId).orFail(() => new NotFoundError('Карточка с данным id не найдена'));

    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('Нельзя удалять карточки других пользователей');
    }

    await Card.findByIdAndDelete(cardId);

    res.status(200).send({ message: 'Карточка успешно удалена' });

    return;
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send({ data: card });
    return;
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send({ data: card });
    return;
  } catch (err) {
    next(err);
  }
};
