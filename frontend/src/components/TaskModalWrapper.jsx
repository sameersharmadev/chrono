import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import TaskModal from './TaskModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TaskModalWrapper({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchTask = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
            credentials: 'include',
          });
          if (!res.ok) throw new Error('Failed to fetch task');
          const data = await res.json();
          setTaskData(data.task || data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, mode]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = async (payload) => {
    const url = mode === 'edit'
      ? `${API_BASE_URL}/api/tasks/${id}`
      : `${API_BASE_URL}/api/tasks`;

    const method = mode === 'edit' ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save task');

      handleClose(); // close modal on success
    } catch (err) {
      alert(err.message || 'Error submitting form');
    }
  };

  return (
    <>
      {mode === 'edit' && loading ? null : (
        <TaskModal
          isOpen={true}
          onClose={handleClose}
          onSubmit={handleSubmit}
          initialData={mode === 'edit' ? taskData : null}
        />
      )}
      {error && (
        <div className="fixed inset-0 z-50 bg-black/80 text-white flex items-center justify-center">
          <div className="bg-red-700 p-4 rounded-md">
            <p className="mb-2">Error: {error}</p>
            <button
              onClick={handleClose}
              className="px-3 py-1 rounded bg-white text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
