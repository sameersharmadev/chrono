import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const DESCRIPTION_LIMIT = 250;

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState('');
  const [initialSnapshot, setInitialSnapshot] = useState('');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      const t = initialData.title || '';
      const d = initialData.description || '';
      const p = initialData.priority || 'medium';
      const du = initialData.due_date?.slice(0, 16) || '';
      const r = initialData.reminder?.slice(0, 16) || '';
      setTitle(t);
      setDescription(d);
      setPriority(p);
      setDueDate(du);
      setReminder(r);
      setInitialSnapshot(`${t}|${d}|${p}|${du}|${r}`);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setReminder('');
      setInitialSnapshot('');
    }
  }, [initialData]);

  const currentSnapshot = `${title}|${description}|${priority}|${dueDate}|${reminder}`;
  const isDirty =
    currentSnapshot !== initialSnapshot &&
    (title.trim() || description.trim() || dueDate || reminder || priority !== 'medium');

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        if (isDirty) {
          setShowCloseConfirm(true);
        } else {
          onClose();
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDirty, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.length > DESCRIPTION_LIMIT) return;
    onSubmit({
      title,
      description,
      priority,
      due_date: dueDate || null,
      reminder: reminder || null,
    });
  };

  const closeModal = () => {
    if (isDirty) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
  };

  const cancelClose = () => {
    setShowCloseConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div
        ref={modalRef}
        className={clsx(
          'w-full max-w-lg rounded-md shadow-lg border p-6',
          'bg-[#f5f5f5] text-black dark:bg-[#1a1a1a] dark:text-white border-[#ccc] dark:border-[#2a2a2a]'
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData?.id ? 'Edit Task' : 'Create Task'}
          </h2>
          <button onClick={closeModal}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full rounded-sm px-3 py-2 text-sm border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#2a2a2a] dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full rounded-sm px-3 py-2 text-sm border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#2a2a2a] dark:text-white resize-none"
              rows={3}
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= DESCRIPTION_LIMIT) {
                  setDescription(e.target.value);
                }
              }}
            />
            <div className="text-xs mt-1 text-right text-gray-600 dark:text-gray-400">
              {DESCRIPTION_LIMIT - description.length} characters left
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="w-full rounded-sm px-3 py-2 text-sm border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#2a2a2a] dark:text-white"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Due Date (optional)</label>
              <input
                type="datetime-local"
                className="w-full rounded-sm px-3 py-2 text-sm border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#2a2a2a] dark:text-white"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reminder Time (optional)</label>
            <input
              type="datetime-local"
              className="w-full rounded-sm px-3 py-2 text-sm border border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#2a2a2a] dark:text-white"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={description.length > DESCRIPTION_LIMIT}
              className={clsx(
                "px-4 py-2 rounded-sm text-sm font-medium transition",
                "bg-black text-white dark:bg-white dark:text-black hover:opacity-90",
                description.length > DESCRIPTION_LIMIT && "opacity-50 cursor-not-allowed"
              )}
            >
              {initialData?.id ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

      {showCloseConfirm && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Close Task Editor?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              You’ve made changes. Are you sure you want to close without saving?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelClose}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmClose}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
