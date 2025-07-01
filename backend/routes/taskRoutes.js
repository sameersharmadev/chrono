import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  createTaskHandler,
  getTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getTasksBetweenHandler,
  getMonthlyTaskMapHandler,
  getTaskByIdHandler,

} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect); 

router.post('/', createTaskHandler);
router.get('/', getTasksHandler);
router.get('/range', getTasksBetweenHandler); 
router.get('/month', getMonthlyTaskMapHandler);
router.get('/:id', getTaskByIdHandler);
router.put('/:id', updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;
