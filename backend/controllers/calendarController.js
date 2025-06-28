import { getTasksBetweenDates } from '../models/taskModel.js';

export async function getTasksInRange(req, res) {
  const userId = req.user.id;
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: "Start and end date are required" });
  }

  try {
    const tasks = await getTasksBetweenDates(userId, start, end);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
