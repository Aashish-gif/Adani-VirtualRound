import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';
import { createRequest, getRequests, getRequestById, updateRequest, getCalendar, getByEquipment } from '../controllers/request.controller.js';

const router = Router();

router.post('/', authMiddleware, createRequest);
router.get('/', authMiddleware, getRequests);
router.get('/calendar', authMiddleware, getCalendar); // place before param route
router.get('/by-equipment/:equipmentId', authMiddleware, getByEquipment);
router.get('/:id', authMiddleware, getRequestById);
router.patch('/:id', authMiddleware, permit('technician', 'manager', 'admin'), updateRequest);

export default router;
