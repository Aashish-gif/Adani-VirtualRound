import { Router } from 'express';
import { createTeam, getTeams, getTeamById } from '../controllers/team.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', authMiddleware, permit('admin', 'manager'), createTeam);
router.get('/', authMiddleware, permit('admin', 'manager'), getTeams);
router.get('/:id', authMiddleware, permit('admin', 'manager'), getTeamById);

export default router;
