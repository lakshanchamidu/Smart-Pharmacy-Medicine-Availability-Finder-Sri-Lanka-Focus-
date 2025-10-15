import { Router } from 'express';
import { searchAvailability } from '../controllers/search.controller.js';

const router = Router();

router.get('/', searchAvailability);

export default router;
