import express from 'express';
import {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  addConnection,
  updateConnection,
  deleteConnection,
  uploadContactAvatar,
  deleteContactAvatar,
} from '../controllers/contactController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// All contact routes require authentication
router.use(authenticate);

// Contact CRUD
router.get('/', getAllContacts);
router.post('/', createContact);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

// Avatar management
router.post('/:id/avatar', upload.single('avatar'), uploadContactAvatar);
router.delete('/:id/avatar', deleteContactAvatar);

// Connection management (nested under contacts)
router.post('/:id/connections', addConnection);
router.put('/:id/connections/:connectionId', updateConnection);
router.delete('/:id/connections/:connectionId', deleteConnection);

export default router;
