import pool from './db.js';

export async function createTag(name) {
  const { rows } = await pool.query(
    `INSERT INTO tags (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING *`,
    [name]
  );
  return rows[0];
}

export async function getAllTags() {
  const { rows } = await pool.query(`SELECT * FROM tags ORDER BY name`);
  return rows;
}

export async function linkTagToTask(taskId, tagId) {
  await pool.query(
    `INSERT INTO task_tags (task_id, tag_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [taskId, tagId]
  );
}

export async function getTagsForTask(taskId) {
  const { rows } = await pool.query(
    `SELECT tags.*
     FROM tags
     JOIN task_tags ON tags.id = task_tags.tag_id
     WHERE task_tags.task_id = $1`,
    [taskId]
  );
  return rows;
}

export async function unlinkTagFromTask(taskId, tagId) {
  await pool.query(
    `DELETE FROM task_tags WHERE task_id = $1 AND tag_id = $2`,
    [taskId, tagId]
  );
}

export async function getUserTasksByTag(userId, tagId) {
    const { rows } = await pool.query(
      `SELECT t.*
       FROM tasks t
       JOIN task_tags tt ON t.id = tt.task_id
       WHERE t.user_id = $1 AND tt.tag_id = $2
       ORDER BY t.created_at DESC`,
      [userId, tagId]
    );
    return rows;
  }
  