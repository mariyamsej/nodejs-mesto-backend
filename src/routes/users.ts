import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUserById,
  updateProfile,
  getCurrentUser,
  updateAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(300).required(),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
}), updateAvatar);

export default router;
