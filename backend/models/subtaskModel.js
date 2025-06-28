import pool from './db.js';

export async function addSubtask(taskId, title) {
  const { rows } = await pool.query(
    `INSERT INTO subtasks (task_id, title)
     VALUES ($1, $2)
     RETURNING *`,
    [taskId, title]
  );
  return rows[0];
}

export async function getTaskSubtasks(taskId) {
  const { rows } = await pool.query(
    `SELECT * FROM subtasks
     WHERE task_id = $1
     ORDER BY created_at ASC`,
    [taskId]
  );
  return rows;
}

export async function updateSubtaskById(subtaskId, { title, completed }) {
  const { rows } = await pool.query(
    `UPDATE subtasks
     SET title = COALESCE($1, title),
         completed = COALESCE($2, completed)
     WHERE id = $3
     RETURNING *`,
    [title, completed, subtaskId]
  );
  return rows[0];
}

export async function deleteSubtaskById(subtaskId) {
  await pool.query(`DELETE FROM subtasks WHERE id = $1`, [subtaskId]);
}
