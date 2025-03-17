import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const ConfirmByWorker = ({ isOpen, onRequestClose, job, onConfirm }) => {
  const [workDate, setWorkDate] = useState('');
  const [workTime, setWorkTime] = useState('');
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setWorkDate('');
      setWorkTime('');
      setComment('');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleConfirm = async (status) => {
    setProcessing(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${job.id}/confirm-worker`, // Ensure job.id is correctly passed
        { workDate, workTime, comment, status },
        { withCredentials: true }
      );

      if (data && data.status) {
        onConfirm();
        setSuccess(true);
        setProcessing(false);
        onRequestClose();
      } else {
        setError(data.message || 'Error confirming job by worker.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error confirming job by worker:', error);
      setError(error.response?.data?.message || 'Error confirming job by worker. Please try again.');
      setProcessing(false);
    }
  };

  if (!job) {
    return null;
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Potvrdiť vykonanie práce</h2>
        <p className="mb-2"><strong>Názov práce:</strong> {job.title}</p>
        <p className="mb-2"><strong>Meno tvorcu:</strong> {job.firstName} {job.lastName}</p>
        <p className="mb-2"><strong>Telefón:</strong> {job.phoneNumber}</p>
        <p className="mb-2"><strong>Email:</strong> {job.email}</p>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Dátum práce:</label>
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Čas práce:</label>
          <input
            type="time"
            value={workTime}
            onChange={(e) => setWorkTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Komentár:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Zrušiť
          </button>
          <button
            onClick={() => handleConfirm('successful')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Potvrdiť'}
          </button>
          <button
            onClick={() => handleConfirm('unsuccessful')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Neúspešné'}
          </button>
        </div>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mt-4 text-green-500 text-center">Confirmation succeeded!</div>}
      </div>
    </Modal>
  );
};

export default ConfirmByWorker;
