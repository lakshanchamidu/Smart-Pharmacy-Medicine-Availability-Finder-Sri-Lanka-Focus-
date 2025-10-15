import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { cancelReservation, confirmReservation, createReservation, getReservation, myReservations } from '../controllers/reservation.controller.js';

const router = Router();

router.post('/', requireAuth, createReservation);
router.get('/:id', requireAuth, getReservation);
router.get('/', requireAuth, asyncHandler(async (req, res) => {
  if (req.query.mine === 'true') return myReservations(req, res);
  return res.status(400).json({ message: 'Use ?mine=true' });
}));
router.post('/:id/confirm', requireAuth, confirmReservation);
router.post('/:id/cancel', requireAuth, cancelReservation);

export default router;
