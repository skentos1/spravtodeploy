import React from 'react';
import '../Components/Animacie/Home.css'; // Import the CSS file for the animations

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black'>
      <div className='w-full text-center p-8'>
        <h1 className='text-5xl md:text-6xl font-bold mb-6 animate-fade-in'>
          Hodinový Manžel
        </h1>
        <p className='text-2xl md:text-3xl mb-4 animate-fade-in' style={{ animationDelay: '0.5s' }}>
          Rôzne mini služby pre vás
        </p>
        <p className='text-lg md:text-xl text-gray-600 animate-fade-in' style={{ animationDelay: '1s' }}>
          Ponuky malych prac ako kosenie trávnika, ľahké stavebné práce a mnoho ďalších služieb.
        </p>
      </div>
      <button className='mt-8 bg-black text-white py-2 px-6 rounded-md text-lg hover:bg-gray-800 animate-fade-in' style={{ animationDelay: '1.5s' }}>
        Zistite viac
      </button>
    </div>
  );
}

export default Home;
