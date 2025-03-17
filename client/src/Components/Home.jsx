import React, { useRef } from "react";
import "../Components/Animacie/Home.css"; // Import the CSS file for the animations

const Home = () => {
  const ponukyRef = useRef(null);

  const scrollToPonuky = () => {
    if (ponukyRef.current) {
      ponukyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <div className="w-full max-w-screen-md mx-auto text-center p-4 md:p-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 animate-fade-in">
          SpravToZaMňa
        </h1>
        <p
          className="text-xl md:text-3xl mb-3 md:mb-4 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          Rôzne mini služby pre vás
        </p>
        <p
          className="text-base md:text-xl text-gray-600 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          Ponuky malých prác ako kosenie trávnika, stráženie detí a mnoho
          ďalších služieb.
        </p>
      </div>
      <button
        className="mt-6 md:mt-8 bg-black text-white py-2 px-4 md:px-6 rounded-md text-md md:text-lg hover:bg-gray-800 animate-fade-in"
        style={{ animationDelay: "1.5s" }}
        onClick={scrollToPonuky}
      >
        Zistite viac
      </button>
      <div
        ref={ponukyRef}
        className="mt-20 w-full max-w-screen-md mx-auto p-4 md:p-8"
      ></div>
    </div>
  );
};

export default Home;
