import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Tooltip from '@mui/material/Tooltip';
import { FaInfoCircle } from 'react-icons/fa';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async (page) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/jobs/myjobs`, {
        params: { page, limit: 12 },
        withCredentials: true
      });
      const { jobs, totalJobs } = response.data;
      setJobs(jobs);
      setTotalPages(Math.ceil(totalJobs / 12));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Not authenticated</div>;
  }

  const handleCardClick = async (job) => {
    try {
      // 1) Najprv v pamäti nastavíme hasNewActivity = false,
      //    aby to UI hneď zmizlo
      job.hasNewActivity = false;
      // Povedzme, že chceme v stave re-render, tak môžeme nastaviť
      // setJobs(...), ale pokiaľ joby mapujeme znova, malo by to stačiť

      // 2) Zavoláme backend, aby aj v DB nastavil false
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${job._id}/seen`,
        {}, // nepotrebujeme body
        { withCredentials: true }
      );

      // 3) A potom navigujeme
      navigate(`/myjob/${job._id}`, { state: { job } });
    } catch (err) {
      console.error("Error marking job as seen:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClassAndText = (job) => {
    if (job.canceled) {
      return { text: 'Neúspešná', className: 'bg-red-100 text-red-800', dotClass: 'bg-red-800' };
    }
    if (job.completed) {
      return { text: 'Dokončená', className: 'bg-green-100 text-green-800', dotClass: 'bg-green-800' };
    }
    if (job.dispute) {
      return { text: 'Konfliktná', className: 'bg-yellow-100 text-yellow-800', dotClass: 'bg-yellow-800' };
    }
    if (job.creatorConfirmed.confirmed && !job.workerConfirmed.confirmed) {
      return { text: 'Pracovník zatiaľ nepotvrdil', className: 'bg-blue-100 text-blue-800', dotClass: 'bg-blue-800' };
    }
    if (job.assignedUsers?.length > 0 && !job.confirmedUsers?.length) {
      return { text: 'Potvrďte pracovníka', className: 'bg-gray-100 text-gray-800', dotClass: 'bg-gray-800' };
    }
    if (job.confirmedUsers?.length > 0) {
      return { text: 'Potvrďte ukončenie ', className: 'bg-orange-100 text-orange-800', dotClass: 'bg-orange-800' };
    }
    return { text: 'Dostupná', className: 'bg-green-100 text-green-800', dotClass: 'bg-green-800' };
  };

  return (
    <div className="w-full min-h-screen py-8 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Moje vytvorené práce
        </h1>

        {/* Hlavička pre veľké displeje */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 px-4 py-2 mb-2 bg-gray-200 text-gray-600 font-semibold rounded-t-lg">
          <div>Názov</div>
          <div>Kategória</div>
          <div>Cena</div>
          <div>Adresa</div>
          <div className="flex items-center">
            Status
            <Tooltip
              title={
                <div>
                  <p className="bg-green-100 text-green-800 p-2 rounded mb-2">
                    <strong>Prihlásený:</strong> Práca, na ktorú ste sa
                    prihlásili.
                  </p>
                  <p className="bg-gray-100 text-gray-800 p-2 rounded mb-2">
                    <strong>Dokončená:</strong> Práca bola úspešne dokončená.
                  </p>
                  <p className="bg-red-100 text-red-800 p-2 rounded mb-2">
                    <strong>Neúspešná:</strong> Práca bola zrušená alebo nebola
                    úspešne dokončená.
                  </p>
                  <p className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2">
                    <strong>Konfliktný:</strong> Stav ukončenia práce sa
                    nezhoduje medzi tvorcom a pracovníkom, tento problém rieši
                    tím.
                  </p>
                  <p className="bg-orange-100 text-orange-800 p-2 rounded mb-2">
                    <strong>Potvrďte ukončenie práce:</strong> Tvorca potvrdil
                    ukončenie práce, čaká sa na vaše potvrdenie.
                  </p>
                  <p className="bg-blue-100 text-blue-800 p-2 rounded mb-2">
                    <strong>Tvorca zatiaľ nepotvrdil:</strong> Ukončenie práce
                    bolo potvrdené Vami, ale čaká sa na potvrdenie od Tvorcu
                    práce.
                  </p>
                </div>
              }
            >
              <span>
                <FaInfoCircle className="inline ml-2 text-lg text-gray-300 cursor-pointer" />
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Hlavička pre mobil */}
        <div className="lg:hidden flex justify-between px-4 py-2 bg-gray-200 text-gray-600 font-semibold rounded-t-lg">
          <span>Názov, Kategória, Cena</span>
          <span>Adresa, Status</span>
        </div>

        {/* Mapa jobov */}
        <div className="divide-y">
          {jobs.map((job) => {
            const { text, className, dotClass } = getStatusClassAndText(job);
            const showRedDot = job.hasNewActivity === true;

            // Zvýraznenie okraja (ak job.hasNewActivity)
            const highlightClasses = showRedDot
              ? "border-l-4 border-red-400 bg-gray-100"
              : "bg-white";

            return (
              <div
                key={job._id}
                className={`relative p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 mb-4 cursor-pointer ${highlightClasses}`}
                onClick={() => handleCardClick(job)}
              >
                {/* Grid: 1 col pre mobile, 5 cols pre desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-4">
                  {/* 1: Názov */}
                  <div className="flex items-start mb-2 lg:mb-0 lg:items-center col-span-1">
                    <div className="text-lg lg:text-xl font-semibold text-gray-900">
                      {job.title}
                    </div>
                  </div>

                  {/* 2: Kategória */}
                  <div className="text-sm lg:text-base text-gray-500">
                    {job.category}
                  </div>

                  {/* 3: Cena */}
                  <div className="text-sm lg:text-base font-semibold text-gray-900">
                    {job.price} €
                  </div>

                  {/* 4: Adresa */}
                  <div className="text-sm lg:text-base text-gray-500">
                    {job.address}
                  </div>

                  {/* 5: Stĺpec: Status + "NOVÉ" (zarovnané vedľa seba) */}
                  <div className="flex items-center mt-2 lg:mt-0 lg:justify-center gap-2">
                    {/* Bodka statusu */}
                    <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                    {/* Badge so stavom */}
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${className}`}
                    >
                      {text}
                    </span>

                    {/* Tu sme zrušili tooltip pri prácach, ako žiadaš */}

                    {/* Badge NOVÉ (pulzujúci) */}
                    {showRedDot && (
                      <div
                        className="
                          flex items-center justify-center
                          bg-red-500 text-white
                          text-xs font-bold
                          rounded
                          w-12 h-6
                          animate-pulse
                        "
                      >
                        NOVÉ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINÁCIA */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
          >
            {"<"}
          </button>
          <span className="px-4 py-2 mx-1 bg-gray-200 text-gray-800 rounded-md">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
