import React, { useState, useEffect, useRef } from 'react';
import banner from '../assets/postni3.jpg';
import { useNavigate } from 'react-router-dom';

const TrustAndSafety = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/create-job');
  };

  return (
    <div ref={ref} className="flex flex-col lg:flex-row items-center bg-gray-100 p-8 mx-auto max-w-6xl">
      <div className="lg:w-1/2 flex flex-col justify-center pr-0 lg:pr-16 mb-8 lg:mb-0">
        <h2 className={`text-4xl lg:text-5xl font-bold mb-8 transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-200' : 'opacity-0'}`}>Vytvor prácu jednoducho a pohodlne</h2>
        <ul className="list-none space-y-6 text-lg lg:text-xl">
          <li className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-400' : 'opacity-0'}`}>
            <span className="font-bold">🛡️ Vytvor prácu: </span>
            Zadaj podrobnosti a detaily práce, ktorú potrebuješ
          </li>
          <li className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-600' : 'opacity-0'}`}>
            <span className="font-bold">⭐ Rating a hodnotenia: </span>
            Vyber a potvrď pracovníka pre svoju prácu na základe jeho predošlých hodnotení
          </li>
          <li className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-800' : 'opacity-0'}`}>
            <span className="font-bold">💰 Platba za prácu: </span>
            Poskytujeme bezpečný systém platieb, peniaze sa odošlú až po úspešnom dokončení práce
          </li>
        </ul>
        <div className="hidden lg:flex flex-col items-center">
          <button onClick={handleClick} className={`mt-4 lg:mt-10 bg-gray-700 text-white px-4 py-2 lg:px-8 lg:py-4 rounded-lg text-lg lg:text-2xl transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-1000' : 'opacity-0'} hover:bg-gray-800`}>Postni prácu úplne zadarmo</button>
          <p className={`flex justify-center pt-1 transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-1000' : 'opacity-0'}`}>
            <a href="/ako-fungujeme" className="text-black hover:text-blue-700">
              Zistiť viac
            </a>
          </p>
        </div>
      </div>
      <div className={`lg:w-1/2 relative transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-1200' : 'opacity-0'}`}>
        <img src={banner} alt="Main" className="w-full h-56 sm:h-64 lg:h-auto object-cover rounded-lg" />
        <div className="absolute top-4 left-4 flex items-center bg-white rounded-lg p-2 shadow-lg">
          <img src={banner} alt="Profile" className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 rounded-full" />
          <div className="ml-2 text-xs sm:text-sm lg:text-lg font-semibold">
            <span>5.0</span>
            <span className="text-yellow-500 ml-1">★</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 sm:p-3 lg:p-4 shadow-lg text-gray-700 text-xs sm:text-sm lg:text-lg">
          <div className="flex items-center mb-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Práca dokončená</span>
            <span className="text-xs sm:text-sm lg:text-base ml-2 text-gray-500">2m ago</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m4 8H9m4-16H9m4 8H5m4 4h6m4-4h-2a2 2 0 01-2-2m0 4H5m0-4h14"></path>
            </svg>
            <span>Platba odoslaná</span>
            <span className="text-xs sm:text-sm lg:text-base ml-2 text-gray-500">2m ago</span>
          </div>
        </div>
      </div>
      <div className="block lg:hidden ">
        <button onClick={handleClick} className={`mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg text-lg transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-1000' : 'opacity-0'} hover:bg-gray-800`}>Postni prácu úplne zadarmo</button>
        <p className={`flex justify-center pt-1 transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-1000' : 'opacity-0'}`}>
          <a href="/ako-fungujeme" className="text-black hover:text-blue-700">
            Zistiť viac
          </a>
        </p>
      </div>
    </div>
  );
};

export default TrustAndSafety;
