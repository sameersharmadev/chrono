import {
    createTag,
    getAllTags,
    linkTagToTask,
    getTagsForTask,
    unlinkTagFromTask,
    getUserTasksByTag
  } from '../models/tagModel.js';

  export async function addTag(req, res) {
    const { name } = req.body;
    const tag = await createTag(name);
    res.status(201).json(tag);
  }
  
  export async function getTags(req, res) {
    const tags = await getAllTags();
    res.json(tags);
  }
  
  export async function assignTagsToTask(req, res) {
    const { taskId, tagIds } = req.body;
    if (!taskId || !Array.isArray(tagIds)) {
      return res.status(400).json({ message: 'taskId and tagIds[] are required' });
    }
  
    await Promise.all(tagIds.map(tagId => linkTagToTask(taskId, tagId)));
    res.json({ message: 'Tags assigned to task' });
  }
  
  export async function getTaskTags(req, res) {
    const { taskId } = req.params;
    const tags = await getTagsForTask(taskId);
    res.json(tags);
  }
  
  export async function removeTagFromTask(req, res) {
    const { taskId, tagId } = req.params;
    await unlinkTagFromTask(taskId, tagId);
    res.sendStatus(204);
  }
  export async function getTasks(req, res) {
    const userId = req.user.id;
    const { tag } = req.query;
  
    const tasks = tag
      ? await getUserTasksByTag(userId, tag)
      : await getUserTasks(userId);
  
    res.json(tasks);
  }