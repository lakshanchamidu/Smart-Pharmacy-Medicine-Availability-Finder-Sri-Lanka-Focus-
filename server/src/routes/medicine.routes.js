import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';
import { createMedicine, getMedicine, searchMedicines } from '../controllers/medicine.controller.js';

const router = Router();

router.get('/', searchMedicines);
router.get('/:id', getMedicine);
router.post('/', requireAuth, requireRoles('admin', 'pharmacy'), createMedicine);

export default router;
