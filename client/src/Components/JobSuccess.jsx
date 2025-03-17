import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaDollarSign, FaClock, FaList } from 'react-icons/fa';

const JobSuccess = () => {
  const location = useLocation();
  const { job } = location.state;
  const navigate = useNavigate();

  const handleViewJobs = () => {
    navigate('/moje-prace'); // Assuming you have a route for viewing jobs
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100  pb-12">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-2xl w-full">
        <div className="text-center mb-8">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">Práca úspešne vytvorená!</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
          <div className="flex items-center space-x-2">
            <FaList className="text-blue-500" />
            <p className="text-lg"><strong>Názov:</strong> {job.title}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaList className="text-blue-500" />
            <p className="text-lg"><strong>Kategória:</strong> {job.category}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaClock className="text-blue-500" />
            <p className="text-lg"><strong>Odhadovaný čas práce:</strong> {job.estimatedTime} hodín</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <p className="text-lg"><strong>Mesto:</strong> {job.city}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <p className="text-lg"><strong>Adresa:</strong> {job.address}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaDollarSign className="text-blue-500" />
            <p className="text-lg"><strong>Cena:</strong> {job.price} €</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
          <div className="flex items-center space-x-2">
            <FaUser className="text-blue-500" />
            <p className="text-lg"><strong>Meno:</strong> {job.firstName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaUser className="text-blue-500" />
            <p className="text-lg"><strong>Priezvisko:</strong> {job.lastName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaPhone className="text-blue-500" />
            <p className="text-lg"><strong>Telefónne číslo:</strong> {job.phoneNumber}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-blue-500" />
            <p className="text-lg"><strong>Email:</strong> {job.email}</p>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={handleViewJobs}
            className="mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
          >
            Zobraziť Moje Práce
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSuccess;
