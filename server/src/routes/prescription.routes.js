import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { upload } from '../services/upload.service.js';
import { cancelPrescription, confirmFromQuote, createPrescription, getPrescription, markUnderReview, myPrescriptions, decision } from '../controllers/prescription.controller.js';

const router = Router();

router.post('/', requireAuth, upload.array('files', 3), createPrescription);
router.get('/', requireAuth, asyncHandler(async (req, res) => {
  if (req.query.mine === 'true') return myPrescriptions(req, res);
  return res.status(400).json({ message: 'Use ?mine=true' });
}));
router.get('/:id', requireAuth, getPrescription);
router.post('/:id/review', requireAuth, requireRoles('pharmacy', 'admin'), markUnderReview);
router.post('/:id/decision', requireAuth, requireRoles('pharmacy', 'admin'), decision);
router.post('/:id/cancel', requireAuth, cancelPrescription);
router.post('/:id/confirm', requireAuth, confirmFromQuote);

export default router;
