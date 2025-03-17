import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import ConfirmByWorker from "./ConfirmByWorker";
import Rating from "react-rating-stars-component";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "./AuthContext";
import Comments from "./Comments";
import JobPhotos from "./JobPhotos";
import SignupModal from "./Modal/SignupModal";


const containerStyle = {
  width: "100%",
  height: "400px",
};

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const [userAssigned, setUserAssigned] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [isWorkerConfirmModalOpen, setIsWorkerConfirmModalOpen] =
    useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("info");
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (id) {
      fetchJobDetail();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (job && job.address) {
      fetchCoordinates(`${job.address}, ${job.district}, ${job.city}`);
    }
  }, [job]);

  const fetchJobDetail = async () => {
    try {
      const config =
        isAuthenticated && token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${id}`,
        config
      );
      if (response.status === 200) {
        const { job, userConfirmed, userAssigned } = response.data;
        setJob(job);
        setUserConfirmed(userConfirmed);
        setUserAssigned(userAssigned);
        fetchConfirmationStatus(job);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      alert(
        "Nepodarilo sa načítať podrobnosti o práci. Skontrolujte svoje sieťové pripojenie a skúste to znova."
      );
    }
  };

  const fetchCoordinates = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `/google-maps-api/maps/api/geocode/json?address=${encodedAddress}&key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }`;
    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setCenter({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const fetchConfirmationStatus = (job) => {
    if (job.dispute) {
      setConfirmationStatus({
        status: "dispute",
        creatorComment: job.creatorConfirmed?.comment || "",
        creatorRating: job.creatorConfirmed?.rating || 0,
        creatorSuccess: job.creatorConfirmed?.success,
        workerComment: job.workerConfirmed?.comment || "",
        workerSuccess: job.workerConfirmed?.success,
      });
    } else if (job.creatorConfirmed?.confirmed) {
      setConfirmationStatus({
        status: job.creatorConfirmed.success ? "successful" : "unsuccessful",
        comment: job.creatorConfirmed.comment,
        rating: job.creatorConfirmed.rating,
      });
    }
  };

  // const handleSignup = async () => {
  //   if (!isAuthenticated) {
  //     toast.error("Musíte sa prihlásiť, aby ste sa mohli zapísať na prácu.");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_APP_API_URL}/jobs/${id}/signup`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (response.status === 200) {
  //       const { job, userConfirmed, userAssigned } = response.data;
  //       setJob(job);
  //       setUserConfirmed(userConfirmed);
  //       setUserAssigned(userAssigned);
  //       toast.success("Úspešne ste sa prihlásili na prácu!");
  //     } else {
  //       toast.error(response.data.message || "Prihlásenie zlyhalo.");
  //     }
  //   } catch (error) {
  //     console.error("Error signing up for the job:", error);
  //     toast.error(error.response?.data?.message || "Prihlásenie zlyhalo.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleUnregister = async () => {
    if (!isAuthenticated || !token) {
      toast.error("Musíte byť prihlásený, aby ste sa mohli odhlásiť z práce.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${id}/unregister`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        const { job, userConfirmed, userAssigned } = response.data;
        setJob(job);
        setUserConfirmed(userConfirmed);
        setUserAssigned(userAssigned);
        toast.success("Úspešne ste sa odhlásili z práce.");
      } else {
        toast.error(response.data.message || "Odhlásenie zlyhalo.");
      }
    } catch (error) {
      console.error("Error unregistering from the job:", error);
      toast.error(error.response?.data?.message || "Odhlásenie zlyhalo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkerConfirm = () => {
    setIsWorkerConfirmModalOpen(true);
  };

  if (!isLoaded || !job) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  let jobStatusBadge = null;
  if (job.dispute) {
    jobStatusBadge = (
      <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-center">
        <Tooltip title="Stav ukončenia práce sa nezhoduje, tento problem rieši náš tím.">
          <span>
            <FaExclamationCircle className="inline-block mr-2" />
          </span>
        </Tooltip>
        Táto práca je v spore
      </div>
    );
  } else if (
    job.completed ||
    (job.creatorConfirmed?.success && job.workerConfirmed?.success)
  ) {
    jobStatusBadge = (
      <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center">
        <FaCheckCircle className="inline-block mr-2" />
        Táto práca bola úspešne dokončená
      </div>
    );
  } else if (
    job.canceled ||
    (job.creatorConfirmed?.confirmed &&
      job.workerConfirmed?.confirmed &&
      !job.creatorConfirmed.success &&
      !job.workerConfirmed.success)
  ) {
    jobStatusBadge = (
      <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center">
        <FaTimesCircle className="inline-block mr-2" />
        Táto práca bola neúspešná
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl w-full relative">
        <Toaster />
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {jobStatusBadge}

        {/* Job Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-8 border-b-4 border-gray-800 pb-4 text-center">
          {job.title}
        </h1>

        <div className="flex flex-wrap md:flex-nowrap space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/2 text-left space-y-4">
            <div className="flex items-center">
              <FaUser className="text-black mr-3" />
              <p className="text-lg">
                <strong>Kategória:</strong> {job.category}
              </p>
            </div>
            <div className="flex items-center">
              <FaClock className="text-gray-800 mr-3" />
              <p className="text-lg">
                <strong>Odhadovaný čas:</strong> {job.estimatedTime} hodín
              </p>
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="text-gray-800 mr-3" />
              <div>
                <p className="text-lg flex items-center">
                  <strong>Cena:</strong> {job.price}€
                  <Tooltip
                    title="Pracovník dostane 80% z tejto sumy, zvyšok sú poplatky."
                    arrow
                  >
                    <IconButton
                      size="small"
                      style={{ padding: "0", marginLeft: "0.5rem" }}
                    >
                      <FaInfoCircle className="text-gray-600" size={16} />
                    </IconButton>
                  </Tooltip>
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-gray-800 mr-3" />
              <p className="text-lg">
                <strong>Mesto:</strong> {job.city}, {job.district}
              </p>
            </div>
            <div className="flex items-center">
              <FaHome className="text-gray-800 mr-3" />
              <p className="text-lg">
                <strong>Adresa:</strong> {job.address}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-lg">
                <strong>Popis:</strong> {job.description}
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Miesto práce:
            </h2>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
            >
              <MarkerF position={center} />
            </GoogleMap>
          </div>
        </div>

        <div className="border-t-2 border-gray-300 pt-6 mt-6">
          {/* Navigation Tabs */}
          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row justify-center mb-6 space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              className={`px-4 py-2 mx-2 font-semibold ${
                selectedTab === "info"
                  ? "text-white bg-gray-800"
                  : "text-gray-800 bg-gray-200"
              } rounded w-full sm:w-auto`}
              onClick={() => setSelectedTab("info")}
            >
              Kontaktné informácie
            </button>
            <button
              className={`px-4 py-2 mx-2 font-semibold ${
                selectedTab === "comments"
                  ? "text-white bg-gray-800"
                  : "text-gray-800 bg-gray-200"
              } rounded w-full sm:w-auto`}
              onClick={() => setSelectedTab("comments")}
            >
              Komentáre
            </button>
            <button
              className={`px-4 py-2 mx-2 font-semibold ${
                selectedTab === "photos"
                  ? "text-white bg-gray-800"
                  : "text-gray-800 bg-gray-200"
              } rounded w-full sm:w-auto`}
              onClick={() => setSelectedTab("photos")}
            >
              Fotky
            </button>
          </div>

          {/* Conditionally render content based on selectedTab */}
          {selectedTab === "info" && (
            <>
              {/* Contact Information */}
              <div className=" border-gray-300 pt-2 mt-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                  Kontaktné informácie
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center">
                    <FaUser className="text-gray-800 mr-3" />
                    <p className="text-lg">
                      <strong>Meno:</strong> {job.firstName} {job.lastName}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-800 mr-3" />
                    <p className="text-lg">
                      <strong>Telefónne číslo:</strong> {job.phoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-800 mr-3" />
                    <p className="text-lg">
                      <strong>Email:</strong> {job.email}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedTab === "comments" && <Comments jobId={id} />}

          {selectedTab === "photos" && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fotky práce
              </h2>
              <JobPhotos photos={job.photos} />
            </div>
          )}

          {/* Buttons and Status Messages (always displayed) */}
          <div className="mt-6 flex flex-col items-center md:flex-row md:justify-center md:space-x-4 w-full">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a
                href={`tel:${job.phoneNumber}`}
                className="bg-gray-800 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                Zavolať
              </a>
              <a
                href={`mailto:${job.email}`}
                className="bg-gray-800 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                Poslať Email
              </a>
            </div>
            {!userAssigned && (
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                Prihlásiť sa na túto prácu
              </button>
            )}
            {userAssigned && !userConfirmed && (
              <button
                onClick={handleUnregister}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Odhlásiť sa
              </button>
            )}
          </div>
          <div className="mt-4 text-center">
            {userAssigned && !userConfirmed && (
              <div className="text-lg text-yellow-600 font-bold">
                <p>Ste prihlásený na túto prácu.</p>
                {job.proposedDate && job.proposedTime && (
                  <p>
                    Termín práce:{" "}
                    {new Date(job.proposedDate).toLocaleDateString("sk-SK")}{" "}
                    {job.proposedTime}      
                  </p>
                )}
              </div>
              
            )}
            {userConfirmed && (
              <p className="text-lg text-green-600 font-bold">
                Táto práca vám bola pridelená
              </p>
            )}
          </div>
        </div>

        {userConfirmed && (
          <div className="mt-10 border-t-2 border-gray-300 pt-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Potvrdenie o ukončení práce
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Vaše potvrdenie
                </h2>
                {job.workerConfirmed?.confirmed ? (
                  <div className="space-y-4 p-4 border rounded-lg bg-white shadow-md">
                    <div className="flex items-center">
                      <FaCheckCircle
                        className={`mr-2 ${
                          job.workerConfirmed.success
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                      <p
                        className={`text-lg font-bold ${
                          job.workerConfirmed.success
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {job.workerConfirmed.success
                          ? "Práca úspešne dokončená"
                          : "Práca neúspešná"}
                      </p>
                    </div>
                    <p className="text-gray-600">
                      {job.workerConfirmed.comment}
                    </p>
                    <div className="flex items-center mt-4">
                      <FaCalendarAlt className="text-gray-800 mr-2" />
                      <p className="text-lg">
                        <strong>Dátum práce:</strong>{" "}
                        {job.workerConfirmed.workDate}
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <FaRegClock className="text-gray-800 mr-2" />
                      <p className="text-lg">
                        <strong>Čas práce:</strong>{" "}
                        {job.workerConfirmed.workTime}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border rounded-lg bg-white shadow-md">
                    <div className="flex items-center">
                      <FaExclamationCircle className="text-red-600 mr-2" />
                      <p className="text-lg font-bold text-red-600">
                        Zatiaľ nepotvrdené
                      </p>
                    </div>
                    <div className="flex items-center mt-4">
                      <FaCalendarAlt className="text-gray-800 mr-2" />
                      <p className="text-lg">
                        <strong>Dátum práce:</strong> N/A
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <FaRegClock className="text-gray-800 mr-2" />
                      <p className="text-lg">
                        <strong>Čas práce:</strong> N/A
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Potvrdenie od Tvorcu
                </h2>
                {job.creatorConfirmed?.confirmed ? (
                  <div className="space-y-4 p-4 border rounded-lg bg-white shadow-md">
                    <div className="flex items-center">
                      <FaCheckCircle
                        className={`mr-2 ${
                          job.creatorConfirmed.success
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                      <p
                        className={`text-lg font-bold ${
                          job.creatorConfirmed.success
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {job.creatorConfirmed.success
                          ? "Práca úspešne dokončená"
                          : "Práca neúspešná"}
                      </p>
                    </div>
                    <p className="text-gray-600">
                      {job.creatorConfirmed.comment}
                    </p>
                    <div className="flex items-center mt-4">
                      <FaCalendarAlt className="text-gray-800 mr-2" />
                      <p className="text-lg">
                        <strong>Dátum potvrdenia:</strong>{" "}
                        {job.creatorConfirmed.workDate || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <strong>Hodnotenie od tvorcu:</strong>
                      <Rating
                        count={5}
                        value={job.creatorConfirmed.rating}
                        edit={false}
                        size={24}
                        activeColor="#ffd700"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border rounded-lg bg-white shadow-md">
                    <div className="flex items-center">
                      <FaExclamationCircle className="text-red-600 mr-2" />
                      <p className="text-lg font-bold text-red-600">
                        Zatiaľ nepotvrdené
                      </p>
                    </div>
                    <div className="flex items-center mt-4">
                      <FaCalendarAlt className="text-gray-800 mr-2" />
                      <p className="text-lg">
                        <strong>Dátum potvrdenia:</strong> N/A
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <strong>Hodnotenie od tvorcu:</strong>
                      <Rating
                        count={5}
                        value={0}
                        edit={false}
                        size={24}
                        activeColor="#ffd700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {userConfirmed && !job.workerConfirmed?.confirmed && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleWorkerConfirm}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  Potvrdiť prácu
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <SignupModal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setIsSignupModalOpen(false)}
        jobId={id}
        token={token}
        onSignupSuccess={({ job, userConfirmed, userAssigned }) => {
          setJob(job);
          setUserConfirmed(userConfirmed);
          setUserAssigned(userAssigned);
        }}
      />
      <ConfirmByWorker
        isOpen={isWorkerConfirmModalOpen}
        onRequestClose={() => setIsWorkerConfirmModalOpen(false)}
        job={job}
        onConfirm={() => {
          setJob({ ...job, workerConfirmed: { confirmed: true } });
        }}
      />
    </div>
  );
};

export default JobDetail;
