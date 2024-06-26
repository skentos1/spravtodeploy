import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const JobSuccess = () => {
  const location = useLocation();
  const { job } = location.state;
  const navigate = useNavigate();

  const handleViewJobs = () => {
    navigate('/my-jobs'); // Assuming you have a route for viewing jobs
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Práca úspešne vytvorená!</h1>
        <div className="text-left space-y-4">
          <p><strong>Názov:</strong> {job.title}</p>
          <p><strong>Kategória:</strong> {job.category}</p>
          <p><strong>Odhadovaný čas práce:</strong> {job.estimatedTime}</p>
          <p><strong>Adresa:</strong> {job.address}</p>
          <p><strong>Cena:</strong> {job.price}</p>
          <p><strong>Meno:</strong> {job.firstName}</p>
          <p><strong>Priezvisko:</strong> {job.lastName}</p>
          <p><strong>Telefónne číslo:</strong> {job.phoneNumber}</p>
          <p><strong>Email:</strong> {job.email}</p>
        </div>
        <button
          onClick={handleViewJobs}
          className="mt-8 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Zobraziť Moje Práce
        </button>
      </div>
    </div>
  );
};

export default JobSuccess;
