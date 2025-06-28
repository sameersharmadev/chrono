import {
    addSubtask,
    getTaskSubtasks,
    updateSubtaskById,
    deleteSubtaskById
  } from '../models/subtaskModel.js';
  
  export async function createSubtask(req, res) {
    const { title } = req.body;
    const { taskId } = req.params;
  
    if (!title) return res.status(400).json({ message: 'Title is required' });
  
    const subtask = await addSubtask(taskId, title);
    res.status(201).json(subtask);
  }
  
  export async function getSubtasks(req, res) {
    const { taskId } = req.params;
    const subtasks = await getTaskSubtasks(taskId);
    res.json(subtasks);
  }
  
  export async function updateSubtask(req, res) {
    const { subtaskId } = req.params;
    const { title, completed } = req.body;
  
    const updated = await updateSubtaskById(subtaskId, { title, completed });
    res.json(updated);
  }
  
  export async function deleteSubtask(req, res) {
    const { subtaskId } = req.params;
    await deleteSubtaskById(subtaskId);
    res.sendStatus(204);
  }
  