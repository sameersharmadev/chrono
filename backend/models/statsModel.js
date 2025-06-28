import pool from './db.js';

export async function fetchStreakStats(userId) {
  const { rows } = await pool.query(
    `
    SELECT DISTINCT updated_at::date AS date
    FROM tasks
    WHERE user_id = $1 AND status = 'done'
    ORDER BY date DESC
    `,
    [userId]
  );

  const dates = rows.map(row => row.date.toISOString().split('T')[0]);

  let currentStreak = 0;
  let longestStreak = 0;
  let prevDate = new Date();

  for (const dateStr of dates) {
    const date = new Date(dateStr);
    const diff = (prevDate - date) / (1000 * 60 * 60 * 24);

    if (diff === 1 || currentStreak === 0 && diff === 0) {
      currentStreak++;
    } else if (diff === 0) {
    } else {
      break;
    }

    longestStreak++;
    prevDate = date;
  }

  return {
    currentStreak,
    longestStreak,
  };
}

export async function fetchWeeklySummary(userId) {
  const { rows } = await pool.query(
    `
    SELECT 
      created_at::date AS date,
      COUNT(*) FILTER (WHERE status IS NOT NULL) AS created,
      COUNT(*) FILTER (WHERE status = 'done') AS completed
    FROM tasks
    WHERE user_id = $1
      AND created_at >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY date
    ORDER BY date ASC
    `,
    [userId]
  );

  const today = new Date();
  const summary = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const row = rows.find(r => r.date.toISOString().split('T')[0] === dateStr);
    const created = row ? Number(row.created) : 0;
    const completed = row ? Number(row.completed) : 0;
    const percentage = created === 0 ? 0 : Math.round((completed / created) * 100);

    summary.push({ date: dateStr, created, completed, percentage });
  }

  return summary;
}

