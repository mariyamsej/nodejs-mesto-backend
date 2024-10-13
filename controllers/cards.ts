import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';
import mongoose from 'mongoose';
import { NotFoundError, BadRequestError } from '../errors/errors';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});

    res.status(200).json(cards);
    return;
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  const ownerId = req.body.user._id;

  console.log(req.body.user._id);
  console.log(name, link);

  try {
    if (!name || !link) {
      throw new BadRequestError('Не переданы все необходимые данные');
    }

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      throw new BadRequestError('Некорректный id владельца карточки');
    }

    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send({ data: card });
    return;
  } catch (err) {
    console.error('Ошибка создания карты юзера:', err);
    return next(err);
  }

  // Card.create({ name, link, owner: ownerId })
  // .then(card => {
  //   res.status(201).send({ data: card });
  //   return;
  // })
  // .catch(err => {
  //   console.error('Ошибка создания карты юзера:', err);
  //   res.status(500).send({ message: 'Произошла ошибка' });
  //   return;
  // });
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  // Card.findByIdAndDelete(cardId)
  //   .then(card => {
  //     if (!card) {
  //       return res.status(404).send({ message: 'Карточка не найдена' });
  //     }
  //     res.status(200).send({ message: 'Карточка успешно удалена', data: card });
  //   })
  //   .catch(err => {
  //     console.error('Ошибка при удалении карточки:', err);
  //     res.status(500).send({ message: 'Произошла ошибка при удалении карточки' });
  //   });

  console.log(req.params);

  try {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Некорректный id карточки');
    }

    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка с данным id не найдена');
    }

    await Card.findByIdAndDelete(cardId);

    res.status(200).send({ message: 'Карточка успешно удалена' });
    return;
  } catch (err) {
    return next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      throw new BadRequestError('Некорректный id карточки');
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send({ data: card });
    return;
  } catch (err) {
    return next(err);
  }

  // Card.findByIdAndUpdate(
  //   req.params.cardId,
  //   { $addToSet: { likes: userId } },
  //   { new: true }
  // )
  //   .then((card) => {
  //     if (!card) {
  //       return res.status(404).send({ message: 'Карточка не найдена' });
  //     }
  //     res.send({ data: card });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: `Ошибка при добавлении лайка: ${err.message}` });
  //   });
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      throw new BadRequestError('Некорректный id карточки');
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send({ data: card });
    return;
  } catch (err) {
    return next(err);
  }

  // Card.findByIdAndUpdate(
  //   req.params.cardId,
  //   { $pull: { likes: userId } },
  //   { new: true }
  // )
  //   .then((card) => {
  //     if (!card) {
  //       return res.status(404).send({ message: 'Карточка не найдена' });
  //     }
  //     res.send({ data: card });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: `Ошибка при удалении лайка: ${err.message}` });
  //   });
};
