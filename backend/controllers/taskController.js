import {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask
  } from '../models/taskModel.js';
  
  function normalizeDueDate(dueDate) {
    const date = new Date(dueDate);
    if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
      date.setHours(8, 0, 0);
    }
    return date.toISOString();
  }
  
  export async function createTaskHandler(req, res) {
    const { title, description, priority = 'medium', due_date } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
  
    const normalizedDate = due_date ? normalizeDueDate(due_date) : null;
  
    const task = await createTask({
      userId: req.user.id,
      title,
      description,
      priority,
      due_date: normalizedDate
    });
  
    res.status(201).json(task);
  }
  
  export async function getTasksHandler(req, res) {
    const tasks = await getUserTasks(req.user.id);
    res.json(tasks);
  }
  
  export async function updateTaskHandler(req, res) {
    const taskId = req.params.id;
    const updates = req.body;
  
    if (updates.due_date) {
      updates.due_date = normalizeDueDate(updates.due_date);
    }
  
    const task = await updateTask(taskId, req.user.id, updates);
    if (!task) return res.status(404).json({ message: 'Task not found' });
  
    res.json(task);
  }
  
  export async function deleteTaskHandler(req, res) {
    const taskId = req.params.id;
    await deleteTask(taskId, req.user.id);
    res.status(204).end();
  }
  