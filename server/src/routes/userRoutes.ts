import express from 'express';
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.delete('/avatar', deleteAvatar);

export default router;
