import React from "react";
import useWindowSize from "./useWindowSize"; // Adjust the path as needed
import SmallScreenComponent from "./PonukySmall";
import LargeScreenComponent from "./PonukyLarge";
import { useNavigate } from "react-router-dom";

const PonukyHome = () => {
  const size = useWindowSize();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/create-job");
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-4 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Máte malé domáce práce, ale nemáte na nich čas?
        </h1>
        <p className="text-lg py-4 text-gray-700">
          Tak ich ponúknite niekomu inému veľmi jednoducho...
        </p>
      </div>

      <div className="max-w-screen-lg mx-auto overflow-x-auto hide-scrollbar pb-4">
        {size.width < 768 ? <SmallScreenComponent /> : <LargeScreenComponent />}
      </div>

      <div className="text-center my-8 pt-8">
        <div className="bg-gray-50 py-8 px-4 md:px-24 rounded-lg inline-block">
          <p className="text-xl py-4 text-gray-700">
            Informujte sa o jednoduchom vytváraní prác kliknutím{" "}
            <a
              href="/ako-fungujeme"
              className="text-black underline hover:bg-gray-300 rounded-lg bg-"
            >
              sem
            </a>
            .
          </p>
          <button
            onClick={handleClick}
            className="bg-black text-white font-bold mt-6 py-2 px-4 rounded hover:bg-gray-800"
          >
            Vytvoriť Prácu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PonukyHome;
