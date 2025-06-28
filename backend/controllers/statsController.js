import { fetchTaskStats } from '../models/taskModel.js';
import { fetchStreakStats } from '../models/statsModel.js';

export async function getTaskStats(req, res) {
  const userId = req.user.id;

  try {
    const stats = await fetchTaskStats(userId);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while getting stats' });
  }
}


export async function getStreakStats(req, res) {
  try {
    const userId = req.user.id;
    const streak = await fetchStreakStats(userId);
    res.json(streak);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error calculating streaks' });
  }
}
import { fetchWeeklySummary } from '../models/statsModel.js';

export async function getWeeklySummary(req, res) {
  try {
    const userId = req.user.id;
    const summary = await fetchWeeklySummary(userId);
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating weekly summary' });
  }
}
