import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaSearchPlus } from "react-icons/fa";

const JobPhotos = ({ photos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  if (!photos || photos.length === 0) {
    return (
      <p className="text-center text-gray-600">Táto práca nemá žiadne fotky.</p>
    );
  }

  return (
    <div className="relative">
      {/* Carousel */}
      <Carousel
        showThumbs={true} // Enables thumbnails instead of dots
        showStatus={false}
        infiniteLoop
        useKeyboardArrows
        autoPlay
        stopOnHover
        interval={4000}
        className="rounded-lg shadow-lg"
        renderThumbs={() =>
          photos.map((photo, index) => (
            <img
              key={index}
              src={`${import.meta.env.VITE_APP_API_URL}/job_pictures/${
                photo.filename
              }`}
              alt={`Thumbnail ${index + 1}`}
              className="w-16 h-16 object-cover rounded-md"
            />
          ))
        }
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() =>
              openModal(
                `${import.meta.env.VITE_APP_API_URL}/job_pictures/${
                  photo.filename
                }`
              )
            }
          >
            {/* Image */}
            <img
              src={`${import.meta.env.VITE_APP_API_URL}/job_pictures/${
                photo.filename
              }`}
              alt={`Fotka ${index + 1}`}
              className="w-[250px] h-[250px] object-contain rounded-lg shadow-md mx-auto"
            />
            {/* Overlay with Icon */}
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
              <FaSearchPlus className="text-white text-3xl" />
            </div>
          </div>
        ))}
      </Carousel>

      {/* Modal for full image */}
      {isModalOpen && selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedPhoto}
              alt="Selected"
              className="max-w-full max-h-screen rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPhotos;
