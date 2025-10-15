import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';
import { getInventory, upsertInventory } from '../controllers/inventory.controller.js';

const router = Router();

router.get('/', getInventory);
router.put('/', requireAuth, requireRoles('pharmacy', 'admin'), upsertInventory);

export default router;
