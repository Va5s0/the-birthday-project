import { Router } from 'express';
import { getAllNamedays, searchNamedays } from '../controllers/namedaysController';

const router = Router();

// Public routes (no authentication required for reference data)
router.get('/', getAllNamedays);
router.get('/search', searchNamedays);

export default router;
