import express from 'express';
import {
  addTag,
  getTags,
  assignTagsToTask,
  getTaskTags,
  removeTagFromTask
} from '../controllers/tagController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', protect, getTags);
router.post('/', protect, addTag);
router.post('/assign', protect, assignTagsToTask);
router.get('/task/:taskId', protect, getTaskTags);
router.delete('/task/:taskId/:tagId', protect, removeTagFromTask);

export default router;
