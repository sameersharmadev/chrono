import express from 'express';
import { getTaskStats,getStreakStats } from '../controllers/statsController.js';
import { protect } from '../middlewares/auth.js';
import { getWeeklySummary } from '../controllers/statsController.js';


const router = express.Router();

router.get('/', protect, getTaskStats);
router.get('/streak', protect, getStreakStats);
router.get('/weekly-summary', protect, getWeeklySummary);

export default router;
