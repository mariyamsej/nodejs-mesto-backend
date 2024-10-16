import { Router } from 'express';
import { getUsers, getUserById, /*createUser,*/ updateProfile, getCurrentUser } from '../controllers/users';

const router = Router();

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', getUserById);

// router.post('/users', createUser);

router.patch('/users/me', updateProfile);

export default router;
