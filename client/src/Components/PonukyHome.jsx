import React, { useState, useRef, useEffect } from 'react';
import kosenie from '../assets/kosenie.jpg';
import murovanie from '../assets/murovanie.jpg';
import rubanie from '../assets/rubanie.jpg';

const PonukyHome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    {
      img: kosenie,
      praca: 'Kosenie travy',
      cena: '10€',
      mesto: 'Vranov nad Toplou',
      adresa: 'Lucna',
      mobil: '0907328732',
    },
    {
      img: murovanie,
      praca: 'Murovanie',
      cena: '20€',
      mesto: 'Vranov nad Toplou',
      adresa: 'Lucna',
      mobil: '0907328732',
    },
    {
      img: rubanie,
      praca: 'Rubanie dreva',
      cena: '15€',
      mesto: 'Vranov nad Toplou',
      adresa: 'Lucna',
      mobil: '0907328732',
    },
    {
      img: murovanie,
      praca: 'Oprava Spotrebicov',
      cena: '22€',
      mesto: 'Vranov nad Toplou',
      adresa: 'Lucna',
      mobil: '0907328732',
      },
  ];

  const refs = items.map(() => useRef(null));

  useEffect(() => {
    if (activeIndex !== 0) {
      refs[activeIndex].current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeIndex, refs]);

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-4 bg-white">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Mate malé domáce práce, ale nemáte na nich čas?
        </h1>
        <p className="text-lg py-4 text-gray-700">Tak ich ponúknite niekomu inému velmi jednoducho...</p>
      </div>

      {/* Carousel Section */}
      <div className="max-w-5xl mx-auto overflow-x-auto hide-scrollbar pb-4">
        <div className="flex ">
          {items.map((item, index) => (
            <div
              key={index}
              ref={refs[index]}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-72 h-auto cursor-pointer relative transition-transform duration-300 ${
                activeIndex === index ? 'transform scale-105' : 'transform scale-75'
              } ${index !== activeIndex && 'hover:-translate-y-4'}`}
            >
              <div className="relative">
                <img
                  className={`w-full h-[400px] object-cover rounded-t-xl ${activeIndex !== index ? 'grayscale' : ''}`}
                  src={item.img}
                  alt={item.praca}
                />
                {activeIndex !== index && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 text-2xl font-bold rounded-t-lg">
                    {item.praca}
                  </div>
                )}
              </div>
              {activeIndex === index && (
                <div className="p-2 shadow-xl rounded-b-lg border border-t-0 border-gray-300 bg-white">
                  <h1 className="text-black text-2xl font-bold text-center pt-2 pb-1">{item.praca}</h1>
                  <p className="text-[#6082b6] text-xl text-center pb-1 font-semibold">{item.cena}</p>
                  <div className="text-center font-medium">
                    <p className="text-black text-lg border-b py-1">{item.mesto}</p>
                    <p className="text-black text-lg border-b py-1">{item.adresa}</p>
                    <p className="text-black text-lg border-b py-1">{item.mobil}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Informative Text */}
      <div className="text-center my-8 pt-8">
        <div className="bg-gray-50 py-8 px-24 rounded-lg inline-block">
          <p className="text-xl py-4 text-gray-700">
            Informujte sa o jednoduchom vytváraní prác kliknutím{' '}
            <a href="/o-nas" className="text-black underline hover:bg-gray-300 rounded-lg bg-">
              sem
            </a>
            .
          </p>
          <button className='bg-black text-white font-bold mt-6 py-2 px-4 rounded hover:bg-gray-800'>
            Vytvoriť Prácu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PonukyHome;
