import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { User } from '../models/User.js';

const router = Router();

router.patch('/me', requireAuth, asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, phone }, { new: true }).select('-passwordHash');
  res.json(user);
}));

export default router;
