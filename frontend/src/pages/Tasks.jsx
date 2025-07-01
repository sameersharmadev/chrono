import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  X,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Trash2,
  Bell,
  Pencil
} from 'lucide-react';
import TaskModal from '../components/TaskModal';

export default function TasksPage() {
  const navigate = useNavigate();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState('todo');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef(null);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterMenu(false);
        setActiveSubMenu('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setShowDeleteModal(false);
        setTaskToDelete(null);
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  async function fetchAllTasks() {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
      const tagMap = {};
      data.forEach(task => {
        (task.tags || []).forEach(tag => {
          tagMap[tag.name] = tag;
        });
      });
      setTags(Object.values(tagMap));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleComplete(task) {
    const updatedStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus })
      });
      if (!res.ok) throw new Error('Failed to update');
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: updatedStatus } : t));
    } catch (err) {
      console.error(err);
    }
  }

  function handleDeleteClick(taskId) {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  }

  async function confirmDeleteTask() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      setTasks(tasks.filter(t => t.id !== taskToDelete));
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  }

  function isTaskBeforeOrOn(dateString, taskDateString) {
    return new Date(taskDateString).toISOString().split('T')[0] <= dateString;
  }

  const filteredTasks = tasks
    .filter(t => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (priority && t.priority !== priority) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTags.length > 0 && !(selectedTags.every(tag => (t.tags || []).some(tg => tg.name === tag)))) return false;

      if (dateFilter) {
        let targetDate = new Date();
        if (dateFilter === 'tomorrow') targetDate.setDate(targetDate.getDate() + 1);
        else if (dateFilter === 'custom' && customDate) targetDate = new Date(customDate);
        const isoDate = targetDate.toISOString().split('T')[0];

        if (!t.due_date || !isTaskBeforeOrOn(isoDate, t.due_date)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priorities = ['urgent', 'high', 'medium', 'low'];
      return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
    });

  const priorityClasses = {
    urgent: {
      base: 'bg-red-500/10 text-red-500 border border-red-500/20',
      selected: 'bg-red-500/20 text-red-600 border border-red-500'
    },
    high: {
      base: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
      selected: 'bg-orange-500/20 text-orange-600 border border-orange-500'
    },
    medium: {
      base: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
      selected: 'bg-yellow-500/20 text-yellow-700 border border-yellow-500'
    },
    low: {
      base: 'bg-green-500/10 text-green-600 border border-green-500/20',
      selected: 'bg-green-500/20 text-green-700 border border-green-500'
    }
  };

  function toggleTag(tagName) {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  }

  return (
    <div className="min-h-[70vh] text-black dark:text-white p-4 sm:p-6 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm flex justify-center items-center">
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6 mb-6">

        {/* Date Filter */}
        <div>
          <div className="font-semibold text-xs mb-1 text-gray-500 uppercase">Due by</div>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
            {['today', 'tomorrow'].map(option => (
              <button
                key={option}
                onClick={() => setDateFilter(prev => (prev === option ? '' : option))}
                className={`text-sm px-3 py-1 rounded border dark:border-gray-600 ${dateFilter === option
                  ? 'bg-[#3a3a3a] text-white'
                  : 'bg-gray-100 dark:bg-[#2a2a2a] text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#3a3a3a]'
                  }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                const selected = e.target.value;
                setCustomDate(selected);
                setDateFilter(prev => (prev === 'custom' && selected === customDate ? '' : 'custom'));
              }}

              className="text-sm bg-gray-100 dark:bg-[#2a2a2a] text-black dark:text-white px-3 py-1 rounded border dark:border-gray-600"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <div className="font-semibold text-xs mb-1 text-gray-500 uppercase">Priority</div>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
            {['urgent', 'high', 'medium', 'low'].map(p => {
              const isSelected = priority === p;
              const styles = isSelected ? priorityClasses[p].selected : priorityClasses[p].base;
              return (
                <button
                  key={p}
                  onClick={() => setPriority(isSelected ? '' : p)}
                  className={`text-sm px-3 py-1 rounded backdrop-blur-sm ${styles} flex items-center gap-1`}
                >
                  <span className="capitalize">{p}</span>
                  {isSelected && <X size={12} className="ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-row-reverse flex-wrap gap-2 items-end w-full">
          {/* Search */}
          <div className="flex-1">
            <div className="font-semibold text-xs mb-1 text-gray-500 uppercase">Search</div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#2a2a2a] px-2 py-1 rounded text-sm">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div ref={filterRef}>
            <div className="font-semibold text-xs mb-1 text-gray-500 uppercase">Filter</div>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-[#2a2a2a] text-sm rounded border dark:border-gray-600"
              >
                Filter <ChevronDown size={14} />
              </button>
              {showFilterMenu && (
                <div className="absolute z-10 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-600 rounded shadow-lg w-40 text-sm">
                  {/* Status */}
                  <div
                    className="relative group"
                    onMouseEnter={() => window.innerWidth > 768 && setActiveSubMenu('status')}
                    onMouseLeave={() => window.innerWidth > 768 && setActiveSubMenu('')}
                  >
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                      onClick={() => setActiveSubMenu(prev => (prev === 'status' ? '' : 'status'))}
                    >
                      <span>Status</span>
                      <ChevronRight size={14} />
                    </button>
                    {activeSubMenu === 'status' && (
                      <div className="absolute left-full top-0 flex flex-col min-w-[150px] bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-600 shadow-lg rounded p-2 z-20">
                        {['all', 'todo', 'in_progress', 'done'].map(f => (
                          <div
                            key={f}
                            onClick={() => {
                              setFilter(f);
                              setActiveSubMenu('');
                              setShowFilterMenu(false);
                            }}
                            className={`px-3 py-1 rounded ${filter === f
                              ? 'bg-[#3a3a3a] text-white font-semibold'
                              : 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                              }`}
                          >
                            {f.replace('_', ' ')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div
                    className="relative group"
                    onMouseEnter={() => window.innerWidth > 768 && setActiveSubMenu('tags')}
                    onMouseLeave={() => window.innerWidth > 768 && setActiveSubMenu('')}
                  >
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                      onClick={() => setActiveSubMenu(prev => (prev === 'tags' ? '' : 'tags'))}
                    >
                      <span>Tags</span>
                      <ChevronRight size={14} />
                    </button>
                    {activeSubMenu === 'tags' && (
                      <div className="absolute left-full top-0 flex flex-col min-w-[150px] bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-600 shadow-lg rounded p-2 z-20">
                        {tags.length > 0 ? (
                          tags.map(tag => (
                            <button
                              key={tag.id}
                              onClick={() => toggleTag(tag.name)}
                              className={`text-left px-3 py-1 rounded text-xs ${selectedTags.includes(tag.name)
                                ? 'bg-[#3a3a3a] text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                                }`}
                            >
                              {tag.name}
                            </button>
                          ))
                        ) : (
                          <span className="text-gray-400 px-3 py-1">No tags</span>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.map(task => (
          <div
            onClick={() => navigate(`/task/${task.id}`)}
            key={task.id}
            className="bg-white dark:bg-[#1e1e1e] p-4 hover:opacity-80 rounded shadow border dark:border-gray-700 flex flex-col gap-2"
          >
            <div className="flex items-start gap-3">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(task);
                }}
                className="w-5 h-5 rounded-full border-2 relative transition-colors duration-200 mt-1 border-gray-400 dark:border-gray-600"
                title="Toggle complete"
              >
                {task.status === 'done' && (
                  <div className="absolute inset-1 rounded-full bg-black dark:bg-white"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="font-semibold text-lg text-left focus:outline-none"
                  >
                    {task.title}
                  </button>
                  {task.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded ${priorityClasses[task.priority]?.base || 'bg-gray-300 text-black'}`}>
                      {task.priority}
                    </span>
                  )}
                  {task.reminder && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Bell size={12} /> {new Date(task.reminder).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {task.description && <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>}
                {task.due_date && <p className="text-xs text-gray-400 dark:text-gray-500">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}</p>}

                {task.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="text-xs bg-gray-200 dark:bg-[#333] text-black dark:text-white px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/task/edit/${task.id}`);
                }}
                className="mt-1 p-2 rounded"
                title="Edit task"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(task.id);
                }}
                className="mt-1 text-red-500 hover:text-red-700 p-2 rounded"
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>


            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/task/new')}
        className="fixed bottom-8 right-8 z-40 bg-violet-600 hover:bg-violet-700 text-white px-4 py-4 rounded-full shadow-lg transition"
      >
        <Plus className="w-5 h-5" />
      </button>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black opacity-90 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Delete Task?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        initialData={editingTask}
        onSubmit={async (data) => {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks${editingTask ? `/${editingTask.id}` : ''}`, {
              method: editingTask ? 'PUT' : 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to save task');
            const result = await res.json();

            if (editingTask) {
              setTasks(prev => prev.map(t => t.id === result.id ? result : t));
            } else {
              setTasks(prev => [result, ...prev]);
            }
            setShowTaskModal(false);
          } catch (err) {
            console.error(err);
          }
        }}
      />

    </div>
  );
}