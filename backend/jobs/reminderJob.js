import cron from 'node-cron';
import pool from '../models/db.js';

export function startReminderJob() {
  console.log('🔁 Reminder job started');

  cron.schedule('* * * * *', async () => {
    const now = new Date();

    // Format local time to 'YYYY-MM-DDTHH:MM'
    const pad = (n) => n.toString().padStart(2, '0');
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const minute = pad(now.getMinutes());
    const localMinute = `${year}-${month}-${day}T${hour}:${minute}`;

    const result = await pool.query(
      `SELECT id, title FROM tasks
       WHERE reminder_time IS NOT NULL
         AND to_char(reminder_time, 'YYYY-MM-DD"T"HH24:MI') = $1`,
      [localMinute]
    );

    for (const task of result.rows) {
      console.log(`🔔 Reminder: Task "${task.title}" is due now`);
    }
  });
}
