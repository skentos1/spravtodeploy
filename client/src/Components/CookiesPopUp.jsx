import React, { useState, useEffect } from "react";
import "../App.css";

const CookiesPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const cookiesAcceptedAt = localStorage.getItem("cookiesAcceptedAt");
    if (cookiesAcceptedAt) {
      const acceptedTime = new Date(parseInt(cookiesAcceptedAt, 10));
      const currentTime = new Date();
      const timeDifference = currentTime - acceptedTime;

      // 5 hours in milliseconds
      const fiveHours = 5 * 60 * 60 * 1000;

      if (timeDifference < fiveHours) {
        setShowPopup(false);
        return;
      }
    }
    setShowPopup(true);
  }, []);

  const handleAccept = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem("cookiesAcceptedAt", currentTime);
    setShowPopup(false);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="cookies-popup fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center">
      <p className="text-sm">
        Táto webová stránka používa cookies na zlepšenie vášho zážitku.
        Pokračovaním v používaní tejto stránky súhlasíte s našimi
        <a
          href="/zasady-ochrany-osobnych-udajov"
          className="text-blue-500 underline ml-1"
        >
          zásadami ochrany osobných údajov
        </a>
        .
      </p>
      <button
        onClick={handleAccept}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
      >
        Akceptovať
      </button>
    </div>
  );
};

export default CookiesPopup;
