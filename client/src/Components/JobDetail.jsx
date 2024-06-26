import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaClock, FaMoneyBillWave, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const JobDetail = () => {
  const location = useLocation();
  const { job } = location.state;
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBFrRK1lI0yF9qJBPw-tG1JWNiVfyL3zUY', // Ensure this is valid
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      const address = encodeURIComponent(job.address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCenter({ lat: location.lat, lng: location.lng });
        } else {
          console.error('No results found for the address');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    fetchCoordinates();
  }, [job.address]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 border-b-4 border-gray-800 pb-4 text-center">{job.title}</h1>
        <div className="flex flex-wrap md:flex-nowrap space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/2 text-left space-y-4">
            <div className="flex items-center">
              <FaUser className="text-black mr-3" />
              <p className="text-lg"><strong>Kategória:</strong> {job.category}</p>
            </div>
            <div className="flex items-center">
              <FaClock className="text-gray-800 mr-3" />
              <p className="text-lg"><strong>Odhadovaný čas práce:</strong> {job.estimatedTime}h</p>
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="text-gray-800 mr-3" />
              <p className="text-lg"><strong>Cena:</strong> {job.price}</p>
            </div>
            <div className="flex items-center">
              <p className="text-lg"><strong>Popis Prace:</strong> {job.description}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Poloha prace:</h2>
            <div className="h-64">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
              >
                <MarkerF position={center} />
              </GoogleMap>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-gray-300 pt-6 mt-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Kontakt</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center">
              <FaUser className="text-gray-800 mr-3" />
              <p className="text-lg"><strong>Meno:</strong> {job.firstName} {job.lastName}</p>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-gray-800 mr-3" />
              <p className="text-lg"><strong>Telefónne číslo:</strong> {job.phoneNumber}</p>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-gray-800 mr-3" />
              <p className="text-lg"><strong>Email:</strong> {job.email}</p>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <a href={`tel:${job.phoneNumber}`} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800">
                Zavolať
              </a>
              <a href={`mailto:${job.email}`} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800">
                Napísať email
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default JobDetail;
