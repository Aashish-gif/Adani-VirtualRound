import { Router } from 'express';
import { createEquipment, getEquipment, getEquipmentById, updateEquipment } from '../controllers/equipment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', authMiddleware, permit('admin', 'manager'), createEquipment);
router.get('/', authMiddleware, getEquipment);
router.get('/:id', authMiddleware, getEquipmentById);
router.patch('/:id', authMiddleware, permit('admin', 'manager'), updateEquipment);

export default router;
