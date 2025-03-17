// UserDetail.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import ConfirmUserModal from "./ConfirmUserModal";
import ReactStars from "react-rating-stars-component";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";

const UserDetail = () => {
  const { jobId, userId } = useParams();
  const [user, setUser] = useState(null);
  const [previousJobs, setPreviousJobs] = useState([]);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState(null); // Nový stav
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isUnconfirming, setIsUnconfirming] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);

  useEffect(() => {
    if (!userId || !jobId) {
      console.error("userId or jobId is undefined");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/users/${userId}`
        );
        const jobResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}`
        );
        const confirmationResponse = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/jobs/${jobId}/user-status/${userId}`
        );

        setUser(userResponse.data.user);
        setPreviousJobs(userResponse.data.user.ratings);
        setTotalJobs(userResponse.data.totalJobs);
        setAverageRating(userResponse.data.avgRating);
        setJob(jobResponse.data.job);
        setUserConfirmed(confirmationResponse.data.userConfirmed);
        if (confirmationResponse.data.userConfirmed) {
          setConfirmationTime(new Date(confirmationResponse.data.confirmedAt));
        }
      } catch (error) {
        console.error("Error fetching user or job details:", error);
        toast.error("Failed to fetch user or job details");
      }
    };

    fetchUserDetails();
  }, [userId, jobId]);

  const confirmUserForJob = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleConfirm = () => {
    setUserConfirmed(true);
    setConfirmationTime(new Date()); // Nastaví čas potvrdenia na aktuálny čas
    setModalIsOpen(false);
  };

  const unconfirmUserForJob = async () => {
    setIsUnconfirming(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_APP_API_URL
        }/jobs/${jobId}/unconfirm-user/${userId}`
      );
      setUserConfirmed(false);
      setConfirmationTime(null);
      toast.success("Používateľ bol úspešne zrušený");
    } catch (error) {
      console.error("Error unconfirming user for job:", error);
      toast.error(`Chyba: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setIsUnconfirming(false);
    }
  };

  const openJobModal = async (jobId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}`
      );
      setSelectedJob(response.data.job); // Nastaví detaily jobu
      setJobModalOpen(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    setJobModalOpen(false);
  };

  const getInitials = (firstName, lastName) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`;

  if (!user || !job) {
    return <div>Načítanie detailov používateľa...</div>;
  }

  const profileImageUrl = user.avatar
    ? `${import.meta.env.VITE_APP_API_URL.replace(/\/$/, "")}${user.avatar}`
    : null;

  const initials = getInitials(user.firstName, user.lastName);

  // Výpočet, či je možné zrušiť potvrdenie (do 24 hodín)
  let canUnconfirm = false;
  if (userConfirmed && confirmationTime) {
    const currentTime = new Date();
    const hoursDifference = Math.abs(currentTime - confirmationTime) / 36e5; // Prevod ms na hodiny
    canUnconfirm = hoursDifference <= 24;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="text-center mb-6">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-500 text-white text-3xl md:text-4xl font-bold">
              {initials}
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{`${user.firstName} ${user.lastName}`}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-center">
            <FaPhone className="text-gray-800 mr-3" />
            <span className="text-lg">{user.phone}</span>
          </div>
          <div className="flex items-center justify-center">
            <FaMapMarkerAlt className="text-gray-800 mr-3" />
            <span className="text-lg">{user.address}</span>
          </div>
        </div>
        <div className="border-t-2 border-gray-300 pt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
            Hodnotenie
          </h2>
          <div className="flex flex-col items-center md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-4">
            <ReactStars
              count={5}
              value={averageRating}
              edit={false}
              size={24}
              activeColor="#ffd700"
            />
            <span className="text-lg text-gray-700">
              {Number(averageRating).toFixed(1)}/5
            </span>
            <span className="text-lg text-gray-700">|</span>
            <span className="text-lg text-gray-700">
              <strong>Počet prác:</strong> {totalJobs}
            </span>
          </div>
        </div>
        <div className="border-t-2 border-gray-300 pt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
            Predošlé práce
          </h2>
          <ul className="space-y-6">
            {(showAllJobs ? previousJobs : previousJobs.slice(0, 2)).map(
              (job) => (
                <li
                  key={job.jobId._id}
                  onClick={() => openJobModal(job.jobId._id)}
                  className="group bg-gray-100 p-6 rounded-xl shadow-md cursor-pointer transition-transform transform hover:-translate-y-2 hover:shadow-xl relative flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
                >
                  {/* Informácie o Jobe */}
                  <div className="flex flex-col space-y-1 sm:w-2/3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {job.jobId.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Kliknite pre viac informácií
                    </p>
                  </div>

                  {/* Hodnotenie a Šípka */}
                  <div className="flex sm:w-1/3 justify-between sm:justify-end items-center">
                    <div className="flex items-center whitespace-nowrap space-x-2">
                      <ReactStars
                        count={5}
                        value={job.rating}
                        edit={false}
                        size={25}
                        activeColor="#ffd700"
                      />
                    </div>
                    <div className="text-blue-500 ml-4 group-hover:text-blue-700 transition-transform transform group-hover:translate-x-1">
                      &rarr;
                    </div>
                  </div>
                </li>
              )
            )}
          </ul>
          {previousJobs.length > 2 && (
            <div className="text-center mt-4">
              {showAllJobs ? (
                <button
                  onClick={() => setShowAllJobs(false)}
                  className="text-blue-500 hover:underline"
                >
                  Zobraziť menej
                </button>
              ) : (
                <button
                  onClick={() => setShowAllJobs(true)}
                  className="text-blue-500 hover:underline"
                >
                  Zobraziť viac
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-center mt-6">
          {userConfirmed ? (
            <>
              <p className="text-green-600 text-lg">
                Používateľ bol potvrdený pre túto prácu.
              </p>
              {canUnconfirm ? (
                <>
                  <button
                    onClick={unconfirmUserForJob}
                    disabled={isUnconfirming}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 mt-4"
                  >
                    {isUnconfirming ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Zrušiť používateľa"
                    )}
                  </button>
                  {confirmationTime && (
                    <p className="text-gray-500 mt-2">
                      Možnosť zrušiť používateľa je dostupná ešte do{" "}
                      {new Date(
                        confirmationTime.getTime() + 24 * 60 * 60 * 1000
                      ).toLocaleString()}
                      .
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 mt-2">
                  Možnosť zrušenia vypršala. Ubehlo viac ako 24 hodín od
                  potvrdenia.
                </p>
              )}
            </>
          ) : (
            <button
              onClick={confirmUserForJob}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Vybrať používateľa
            </button>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {jobModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative transform transition-all">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedJob(null); // Reset selected job
                setJobModalOpen(false);
              }}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold rounded-full p-2 shadow-sm transition-all"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                {selectedJob.title || "N/A"}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedJob.category || "N/A"}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Mesto
                  </span>
                  <span className="text-lg">{selectedJob.city || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Cena
                  </span>
                  <span className="text-lg">€{selectedJob.price || "N/A"}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Popis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedJob.description || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Hodnotenie zákazníka
                </h3>
                <div className="flex items-center space-x-3">
                  <ReactStars
                    count={5}
                    value={selectedJob.creatorConfirmed?.rating || 0}
                    edit={false}
                    size={24}
                    activeColor="#ffd700"
                  />
                  <span className="text-gray-600 text-sm">
                    {selectedJob.creatorConfirmed?.rating ?? "N/A"}/5
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Komentár
                </h3>
                <p className="text-gray-600 italic">
                  {selectedJob.creatorConfirmed?.comment || "Žiadny komentár"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-right">
              <button
                onClick={() => {
                  setSelectedJob(null); // Reset selected job
                  setJobModalOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Zatvoriť
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmUserModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        user={user}
        job={job}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default UserDetail;
