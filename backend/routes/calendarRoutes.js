import express from 'express';
import { getTasksInRange } from '../controllers/calendarController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', protect, getTasksInRange);

export default router;
