import pool from './db.js';

export async function createTask({ userId, title, description, priority, due_date }) {
  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, title, description, priority, due_date]
  );
  return result.rows[0];
}


export async function getUserTasks(userId) {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  const tasks = result.rows;

  for (const task of tasks) {
    task.progress = await getTaskProgress(task.id);
  }

  return tasks;
}


export async function updateTask(taskId, userId, updates) {
  const fields = [];
  const values = [];
  let index = 1;
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }
  fields.push(`updated_at = NOW()`);
  values.push(taskId);
  values.push(userId);

  const query = `
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = $${index} AND user_id = $${index + 1}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteTask(taskId, userId) {
  await pool.query(`DELETE FROM tasks WHERE id = $1 AND user_id = $2`, [taskId, userId]);
}
export async function getTaskProgress(taskId) {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE completed) AS completed,
       COUNT(*) AS total
     FROM subtasks
     WHERE task_id = $1`,
    [taskId]
  );

  const { completed, total } = result.rows[0];
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

export async function getTasksBetweenDates(userId, start, end) {
  const { rows } = await pool.query(
    `SELECT * FROM tasks
     WHERE user_id = $1
     AND due_date BETWEEN $2 AND $3
     ORDER BY due_date ASC`,
    [userId, start, end]
  );
  return rows;
}
export async function fetchTaskStats(userId) {
  const { rows: all } = await pool.query(
    `SELECT 
       COUNT(*) FILTER (WHERE status = 'todo') AS todo,
       COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
       COUNT(*) FILTER (WHERE status = 'done') AS done,
       COUNT(*) AS total
     FROM tasks
     WHERE user_id = $1`,
    [userId]
  );

  const { rows: today } = await pool.query(
    `SELECT COUNT(*) AS completed_today
     FROM tasks
     WHERE user_id = $1 AND status = 'done'
     AND updated_at::date = CURRENT_DATE`,
    [userId]
  );

  const { rows: thisWeek } = await pool.query(
    `SELECT COUNT(*) AS completed_this_week
     FROM tasks
     WHERE user_id = $1 AND status = 'done'
     AND date_trunc('week', updated_at) = date_trunc('week', CURRENT_DATE)`,
    [userId]
  );

  return {
    ...all[0],
    completed_today: Number(today[0].completed_today),
    completed_this_week: Number(thisWeek[0].completed_this_week)
  };
}

