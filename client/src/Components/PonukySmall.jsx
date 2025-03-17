import React, { useState, useRef, useEffect } from 'react';
import kosenie from '../assets/kosenie.jpg';
import oprava from '../assets/oprava.jpg';
import babysitting from '../assets/babysitting.webp';
import stiepanie from '../assets/stiepanie.jpg';

const SmallScreenComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    {
      img: kosenie,
      praca: 'Kosenie trávy',
      cena: '10€',
      mesto: 'Vranov nad Topľou',
      adresa: 'Lúčna 39',
      mobil: '0907438232',
    },
    {
      img: babysitting,
      praca: 'Stráženie detí',
      cena: '20€',
      mesto: 'Košice',
      adresa: 'Námestie Osloboditeľov 21',
      mobil: '0915321223',
    },
    {
      img: stiepanie,
      praca: 'Štiepanie dreva',
      cena: '42€',
      mesto: 'Trenčín',
      adresa: 'Hodžova 22',
      mobil: '0918326732',
    },
    {
      img: oprava,
      praca: 'Oprava Spotrebičov',
      cena: '23€',
      mesto: 'Martin',
      adresa: 'Kollárova 81',
      mobil: '0907421002',
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
    <div className="flex flex-col items-center">
      {items.map((item, index) => (
        <div
          key={index}
          ref={refs[index]}
          onClick={() => setActiveIndex(index)}
          className={`flex-shrink-0 w-full h-auto cursor-pointer relative transition-transform duration-300 mb-4 ${
            activeIndex === index ? 'transform scale-105' : 'transform scale-100'
          } ${index !== activeIndex && 'hover:-translate-y-2'}`}
        >
          <div className="relative">
            <img
              className={`w-full h-48 object-cover rounded-t-xl ${activeIndex !== index ? 'grayscale' : ''}`}
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
              <h1 className="text-black text-xl font-bold text-center pt-2 pb-1">{item.praca}</h1>
              <p className="text-[#6082b6] text-lg text-center pb-1 font-semibold">{item.cena}</p>
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
  );
};

export default SmallScreenComponent;
