import express from 'express';
import {
  createSubtask,
  getSubtasks,
  updateSubtask,
  deleteSubtask
} from '../controllers/subtaskController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:taskId', protect, createSubtask);         
router.get('/:taskId', protect, getSubtasks);           
router.put('/:subtaskId', protect, updateSubtask);       
router.delete('/:subtaskId', protect, deleteSubtask);    

export default router;
