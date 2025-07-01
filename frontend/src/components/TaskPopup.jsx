import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { X, Pencil } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TaskPopup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[TaskPopup] ID from URL params:', id);

    const fetchTask = async () => {
      try {
        console.log(`[TaskPopup] Fetching task from: ${API_BASE_URL}/api/tasks/${id}`);
        const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
          credentials: 'include'
        });

        console.log('[TaskPopup] Response status:', res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error('[TaskPopup] Error response body:', text);
          throw new Error(`Failed to fetch task: ${res.statusText}`);
        }

        const data = await res.json();
        console.log('[TaskPopup] Parsed JSON response:', data);

        const taskData = data.task || data;
        setTask(taskData);
      } catch (err) {
        console.error('[TaskPopup] Fetch error:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    } else {
      console.warn('[TaskPopup] No ID found in route params');
      setError('Invalid task ID');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        navigate(-1);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') navigate(-1);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [navigate]);

  const handleClose = () => navigate(-1);
  const handleEdit = () => navigate(`/task/edit/${id}`);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div
        ref={popupRef}
        className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 pt-14 shadow-lg border border-gray-200 dark:border-[#3a3a3a]"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : task ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black dark:text-white">{task.title}</h2>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 text-sm px-2 py-1 rounded-md 
                  bg-gray-100 text-black hover:bg-gray-200 
                  dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a] transition"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {task.description || 'No description.'}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              {task.due_date && (
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-300">Due:</span>{' '}
                  {new Date(task.due_date).toLocaleString()}
                </p>
              )}
              {task.reminder && (
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-300">Reminder:</span>{' '}
                  {new Date(task.reminder).toLocaleString()}
                </p>
              )}
              {task.priority && (
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-300">Priority:</span>{' '}
                  {task.priority}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Task not found.</p>
        )}
      </div>
    </div>
  );
}
