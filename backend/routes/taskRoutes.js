import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  createTaskHandler,
  getTasksHandler,
  updateTaskHandler,
  deleteTaskHandler
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect); 

router.post('/', createTaskHandler);
router.get('/', getTasksHandler);
router.put('/:id', updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;
