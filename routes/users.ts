import { Router } from 'express';
import { getUsers, getUserById, createUser, updateProfile } from '../controllers/users';

const router = Router();

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me', updateProfile);

export default router;
