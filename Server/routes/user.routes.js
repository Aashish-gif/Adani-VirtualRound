import { Router } from 'express';
import { getUsers, updateUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, permit('admin', 'manager'), getUsers);
router.patch('/:id', authMiddleware, permit('admin'), updateUser);

export default router;
