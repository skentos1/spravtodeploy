import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaInfoCircle } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

const SignedUpJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const jobsPerPage = 12;

  useEffect(() => {
    if (isAuthenticated) {
      fetchSignedUpJobs(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  const fetchSignedUpJobs = async (page) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/jobs/signedup?page=${page}&limit=${jobsPerPage}`,
        { withCredentials: true }
      );
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching signed up jobs:", error);
    }
  };

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
      navigate(`/job/${job._id}`, { state: { job } });
    } catch (err) {
      console.error("Error marking job as seen:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClassAndText = (job) => {
    const status = job.status;
    const creatorConfirmed = job.creatorConfirmed?.confirmed;
    const workerConfirmed = job.workerConfirmed?.confirmed;

    if (status === "successful") {
      return {
        text: "Dokončená",
        className: "bg-gray-100 text-gray-800",
        dotClass: "bg-gray-800",
      };
    }
    if (status === "unsuccessful") {
      return {
        text: "Neúspešná",
        className: "bg-red-100 text-red-800",
        dotClass: "bg-red-800",
      };
    }
    if (status === "dispute") {
      return {
        text: "Konfliktný",
        className: "bg-yellow-100 text-yellow-800",
        dotClass: "bg-yellow-800",
      };
    }
    if (creatorConfirmed && !workerConfirmed) {
      return {
        text: "Potvrďte ukončenie práce",
        className: "bg-orange-100 text-orange-800",
        dotClass: "bg-orange-800",
      };
    }
    if (job.workerConfirmed.confirmed && !job.creatorConfirmed.confirmed) {
      return {
        text: "Tvorca zatiaľ nepotvrdil",
        className: "bg-blue-100 text-blue-800",
        dotClass: "bg-blue-800",
      };
    }

    return {
      text: "Prihlásený",
      className: "bg-green-100 text-green-800",
      dotClass: "bg-green-800",
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Not authenticated
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Práce, na ktoré som sa zapísal
        </h1>

        {/* Hlavná "tabuľka" - hlavička */}
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

        {/* Malá hlavička pre mobil */}
        <div className="lg:hidden flex justify-between px-4 py-2 bg-gray-200 text-gray-600 font-semibold rounded-t-lg">
          <span>Názov, Kategória, Cena</span>
          <span>Adresa, Status</span>
        </div>

        {/* Tu mapujeme samotné joby */}
        <div className="divide-y">
          {jobs.map((job) => {
            const { text, className, dotClass } = getStatusClassAndText(job);
            // Či zobrazíme červenú bodku
            const showRedDot = job.hasNewActivity === true;
            const highlightClasses = job.hasNewActivity
              ? " border-l-4 border-red-400 bg-gray-100 "
              : "bg-white";

            return (
              <div
                key={job._id}
                className={`relative p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 mb-4 cursor-pointer ${highlightClasses}`}
                onClick={() => handleCardClick(job)}
              >
                {/* Jednotný layout pre veľký aj malý displej, 
                    len s použitím responsívnych tried textu. */}
                <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-4">
                  {/* PRVÝ STĹPEC: NÁZOV (mobil aj desktop rovnako) */}
                  <div className="flex items-start mb-2 lg:mb-0 lg:items-center col-span-1 lg:col-span-1">
                    <div className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center">
                      {job.title}
                    </div>
                  </div>

                  {/* DRUHÝ STĹPEC: Kategória (na mobile budeme 
                      nižšie, ale v rovnakej grid col) */}
                  <div className="text-sm lg:text-base text-gray-500 lg:col-span-1">
                    {job.category}
                  </div>

                  {/* TRETÍ STĹPEC: Cena */}
                  <div className="text-sm lg:text-base font-semibold text-gray-900 lg:col-span-1">
                    {job.price} €
                  </div>

                  {/* ŠTVRTÝ STĹPEC: Adresa */}
                  <div className="text-sm lg:text-base text-gray-500 lg:col-span-1">
                    {job.address}
                  </div>

                  {/* PIATY STĹPEC: Status s farebným badge */}
                  <div className="flex items-center mt-2 lg:mt-0 lg:justify-center lg:col-span-1">
                    {/* Malá bodka podľa job.status (dotClass) */}
                    <span className={`h-2 w-2 rounded-full mr-2 ${dotClass}`} />
                    {/* Badge s textom (className) */}
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${className}`}
                    >
                      {text}
                    </span>

                    {/* Tooltip s vysvetlivkami */}
                    <Tooltip
                      title={
                        <div>
                          <p className="bg-green-100 text-green-800 p-2 rounded mb-2">
                            <strong>Prihlásený:</strong> Práca, na ktorú ste sa
                            prihlásili.
                          </p>
                          <p className="bg-gray-100 text-gray-800 p-2 rounded mb-2">
                            <strong>Dokončená:</strong> Práca bola úspešne
                            dokončená.
                          </p>
                          <p className="bg-red-100 text-red-800 p-2 rounded mb-2">
                            <strong>Neúspešná:</strong> Práca bola zrušená alebo
                            nebola úspešne dokončená.
                          </p>
                          <p className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2">
                            <strong>Konfliktný:</strong> Stav ukončenia práce sa
                            nezhoduje medzi tvorcom a pracovníkom, tento problém
                            rieši tím.
                          </p>
                          <p className="bg-orange-100 text-orange-800 p-2 rounded mb-2">
                            <strong>Potvrďte ukončenie práce:</strong> Tvorca
                            potvrdil ukončenie práce, čaká sa na vaše
                            potvrdenie.
                          </p>
                          <p className="bg-blue-100 text-blue-800 p-2 rounded mb-2">
                            <strong>Tvorca zatiaľ nepotvrdil:</strong> Ukončenie
                            práce bolo potvrdené Vami, ale čaká sa na potvrdenie
                            od Tvorcu práce.
                          </p>
                        </div>
                      }
                    >
                      <span>
                        <FaInfoCircle className="inline ml-2 text-lg text-gray-300 cursor-pointer" />
                      </span>
                    </Tooltip>
                    {job.hasNewActivity && (
                      <div className="  bg-red-500 text-white text-xs ml-4 px-2 py-1 rounded animate-pulse ">
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

export default SignedUpJobs;
