import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  getTasksBetweenDates,
  getTaskById
} from '../models/taskModel.js';

function normalizeDueDate(dueDate) {
  const date = new Date(dueDate);
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    date.setHours(8, 0, 0);
  }
  return date.toISOString();
}
export async function createTaskHandler(req, res) {
  const { title, description, priority = 'medium', due_date, reminder } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const normalizedDate = due_date ? normalizeDueDate(due_date) : null;
  const normalizedReminder = reminder ? new Date(reminder).toISOString() : null;

  const task = await createTask({
    userId: req.user.id,
    title,
    description,
    priority,
    due_date: normalizedDate,
    reminder: normalizedReminder
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

export async function getTasksBetweenHandler(req, res) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const target = new Date(date);
    if (isNaN(target)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    const start = new Date(target);
    const end = new Date(target);

    const tasks = await getTasksBetweenDates(req.user.id, start.toISOString(), end.toISOString());
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch tasks by date:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getMonthlyTaskMapHandler(req, res) {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ message: 'Start and end dates required' });
  }

  try {
    const rows = await getTasksBetweenDates(req.user.id, start, end);

    const taskMap = {};

    for (const task of rows) {
      const due = task.due_date?.split('T')[0];
      const reminder = task.reminder_time?.split('T')[0];
      const created = task.created_at?.split('T')[0];

      const addToMap = (dateKey, type) => {
        if (!dateKey) return;
        if (!taskMap[dateKey]) {
          taskMap[dateKey] = { due: [], reminder: [], in_progress: [] };
        }
        taskMap[dateKey][type].push({
          ...task,
          reminder: task.reminder_time
        });
      };

      if (due) addToMap(due, 'due');
      if (reminder) addToMap(reminder, 'reminder');
      if (task.status === 'in_progress') {
        addToMap(due || reminder || created, 'in_progress');
      }
    }

    res.json(taskMap);
  } catch (err) {
    console.error('Failed to fetch monthly task map:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export async function getTaskByIdHandler(req, res) {
  const { id } = req.params;

  try {
    const task = await getTaskById(id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Failed to fetch task:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
