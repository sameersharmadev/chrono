import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

router.get('/recent', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, reminder_time, is_read, due_date
       FROM tasks
       WHERE reminder_time IS NOT NULL
       AND reminder_time <= NOW()
       ORDER BY reminder_time DESC
       LIMIT 5`
    );
    res.json({ reminders: result.rows });
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// PATCH to mark reminder as read
router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE tasks SET is_read = true WHERE id = $1`,
      [id]
    );
    res.status(200).json({ message: 'Reminder marked as read' });
  } catch (err) {
    console.error('Error marking reminder as read:', err);
    res.status(500).json({ error: 'Failed to update reminder status' });
  }
});

export default router;
