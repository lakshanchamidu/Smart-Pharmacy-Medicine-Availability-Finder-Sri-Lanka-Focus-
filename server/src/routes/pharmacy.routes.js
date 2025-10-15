import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';
import { createPharmacy, getPharmacy, listNearby, updatePharmacy } from '../controllers/pharmacy.controller.js';

const router = Router();

router.get('/', listNearby);
router.get('/:id', getPharmacy);
router.post('/', requireAuth, requireRoles('pharmacy', 'admin'), createPharmacy);
router.patch('/:id', requireAuth, requireRoles('pharmacy', 'admin'), updatePharmacy);

export default router;
