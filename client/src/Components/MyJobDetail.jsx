import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import Avatar from "react-avatar";
import ConfirmByCreator from "./ConfirmByCreator";
import Rating from "react-rating-stars-component";
import Tooltip from "@mui/material/Tooltip";
import { AiOutlineClose } from "react-icons/ai";
import CityAutocomplete from "./CityAutocomplete";
import DistrictAutocomplete from "./DistrictAutocomplete";
import Comments from "./Comments";

const containerStyle = {
  width: "100%",
  height: "300px",
};
const categories = [
  "Upratovanie",
  "Kosenie trávy",
  "Záhradnícke práce",
  "Oprava spotrebičov",
  "Maľovanie a natieranie",
  "Montáž nábytku",
  "Stráženie detí",
  "Doučovanie",
  "Starostlivosť o seniorov",
  "Prechádzky so psami",
  "Elektrikárske práce",
  "Inštalatérske práce",
  "Oprava elektroniky",
  "Oprava automobilov",
  "IT podpora",
  "Vývoj webových stránok",
  "Grafický dizajn",
  "Správa sociálnych médií",
  "Osobné nákupy",
  "Asistenčné služby",
  "Šoférske služby",
  "Fotografovanie",
  "Videografia",
  "Hudobné lekcie",
  "Výtvarné kurzy",
  "Osobný tréning",
  "Výživové poradenstvo",
  "Masáže",
  "Joga a meditácia",
  "Organizačné služby",
  "Prekladateľské služby",
  "Účtovnícke služby",
];

const MyJobDetail = () => {
  const { id: jobId } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({});
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [showOtherUsers, setShowOtherUsers] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isCityEditing, setIsCityEditing] = useState(false);
  const [isDistrictEditing, setIsDistrictEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("comments");
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}`,
          { withCredentials: true }
        );
        const jobData = response.data.job;

        if (!jobData.creatorConfirmed) {
          jobData.creatorConfirmed = {
            confirmed: false,
            rating: 0,
            comment: "",
          };
        }

        setJob(jobData);
        setFormData(jobData);
        setPhotos(jobData.photos || []);
        updateMapCenter(jobData.address, jobData.city, jobData.district);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}/assigned-users`,
          { withCredentials: true }
        );
        setAssignedUsers(response.data);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    fetchJob();
    fetchAssignedUsers();
  }, [jobId]);

  useEffect(() => {
    const fetchUserStatuses = async () => {
      const statuses = {};
      for (const user of assignedUsers) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}/user-status/${
              user._id
            }`,
            { withCredentials: true }
          );
          statuses[user._id] = response.data.userConfirmed;
        } catch (error) {
          console.error(`Error fetching status for user ${user._id}:`, error);
        }
      }
      setUserStatuses(statuses);
    };

    if (assignedUsers.length > 0) {
      fetchUserStatuses();
    }
  }, [assignedUsers, jobId]);

  useEffect(() => {
    if (
      assignedUsers.length > 0 &&
      !assignedUsers.some((user) => userStatuses[user._id])
    ) {
      setShowOtherUsers(true);
    }
  }, [assignedUsers, userStatuses]);

  const updateMapCenter = async (address, city, district) => {
    try {
      const fullAddress = `${address}, ${city}, ${district}`;
      const encodedAddress = encodeURIComponent(fullAddress);
      const url = `${
        import.meta.env.VITE_APP_API_URL
      }/google-maps-api/maps/api/geocode/json?address=${encodedAddress}&key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`;
      const geoResponse = await axios.get(url);
      const data = geoResponse.data;
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setCenter({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "address" || name === "city" || name === "district") {
      updateMapCenter(formData.address, formData.city, formData.district);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}`,
        formData,
        { withCredentials: true }
      );
      navigate("/moje-prace");
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}`, {
        withCredentials: true,
      });
      navigate("/moje-prace");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };
  const handlePhotoUpload = async () => {
    if (!newPhoto) return;

    const formData = new FormData();
    formData.append("photo", newPhoto);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}/photos`,
        formData,
        { withCredentials: true }
      );
      setPhotos((prev) => [...prev, response.data.photo]);
      setNewPhoto(null);
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePhotoDelete = async (filename) => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/jobs/${jobId}/photos/${filename}`,
        { withCredentials: true }
      );
      setPhotos((prev) => prev.filter((photo) => photo.filename !== filename));
    } catch (error) {
      console.error("Error deleting photo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/jobs/${jobId}/users/${userId}`);
  };

  const confirmByCreator = (worker) => {
    setSelectedWorker(worker);
    setIsConfirmModalOpen(true);
  };

  const handleCreatorConfirm = () => {
    setJob({ ...job, creatorConfirmed: { confirmed: true } });
    setIsConfirmModalOpen(false);
  };

  if (!isLoaded) {
    return <div>Načítavam...</div>;
  }

  if (!job) {
    return <div>Načítavam podrobnosti o práci...</div>;
  }

  const confirmedUsers = assignedUsers.filter((user) => userStatuses[user._id]);
  const otherUsers = assignedUsers.filter((user) => !userStatuses[user._id]);

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
    (job.creatorConfirmed.success && job.workerConfirmed.success)
  ) {
    jobStatusBadge = (
      <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center">
        <FaCheckCircle className="inline-block mr-2" />
        Táto práca bola úspešne dokončená
      </div>
    );
  } else if (
    job.canceled ||
    (job.creatorConfirmed.confirmed &&
      job.workerConfirmed.confirmed &&
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
  console.log("Job proposedDate:", job.proposedDate, "proposedTime:", job.proposedTime);
  {console.log("Rendering term: ", job.proposedDate, job.proposedTime)}

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        {jobStatusBadge}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b-4 border-gray-800 pb-4 text-center">
          {job.title}
        </h1>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-wrap md:flex-nowrap md:space-x-6">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex flex-col">
                <label className="flex items-center text-lg font-bold">
                  <FaUser className="text-black mr-3" />
                  Kategória:
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="border rounded px-2 py-1 mt-1"
                  required
                >
                  <option value="">Vyberte kategóriu</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="flex items-center text-lg font-bold">
                  <FaClock className="text-gray-800 mr-3" />
                  Odhadovaný čas práce:
                </label>
                <input
                  type="number"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="border rounded px-2 py-1 mt-1"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="flex items-center text-lg font-bold">
                  <FaMoneyBillWave className="text-gray-800 mr-3" />
                  Cena:
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="border rounded px-2 py-1 mt-1"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="flex items-center text-lg font-bold">
                  <FaMapMarkerAlt className="text-gray-800 mr-3" />
                  Okres:
                </label>
                {isDistrictEditing ? (
                  <div className="flex items-center w-full">
                    <DistrictAutocomplete
                      value={formData.district}
                      onChange={(value) => handleChange("district", value)}
                      placeholder="Vyberte okres"
                      className="w-full"
                    />
                    <AiOutlineClose
                      className="ml-2 cursor-pointer text-red-600"
                      onClick={() => setIsDistrictEditing(false)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center w-full">
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full mt-1"
                      disabled
                    />
                    <button
                      type="button"
                      className="ml-2 px-2 py-1 bg-gray-200 rounded"
                      onClick={() => setIsDistrictEditing(true)}
                    >
                      Upraviť
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label className="flex items-center text-lg font-bold">
                  <FaMapMarkerAlt className="text-gray-800 mr-3" />
                  Mesto:
                </label>
                {isCityEditing ? (
                  <div className="flex items-center w-full">
                    <CityAutocomplete
                      value={formData.city}
                      onChange={(value) => handleChange("city", value)}
                      placeholder="Vyberte mesto"
                      className="w-full"
                    />
                    <AiOutlineClose
                      className="ml-2 cursor-pointer text-red-600"
                      onClick={() => setIsCityEditing(false)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center w-full">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full mt-1"
                      disabled
                    />
                    <button
                      type="button"
                      className="ml-2 px-2 py-1 bg-gray-200 rounded"
                      onClick={() => setIsCityEditing(true)}
                    >
                      Upraviť
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-lg font-bold mr-2">Popis Práce:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="border rounded px-2 py-1 mt-1 w-full h-32"
                  required
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex flex-col">
                <label className="flex items-center text-lg font-bold">
                  <FaMapMarkerAlt className="text-gray-800 mr-3" />
                  Poloha práce:
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="border rounded px-2 py-1 mt-1 w-full"
                  required
                />
              </div>
              <div className="h-64 w-full">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={15}
                >
                  <MarkerF position={center} />
                </GoogleMap>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-gray-300 pt-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Kontakt
            </h2>
            <div className="grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="flex items-center text-lg font-bold">
                    <FaUser className="text-gray-800 mr-3" />
                    Meno:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="border rounded px-2 py-1 mt-1 w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-lg font-bold">
                    <FaUser className="text-gray-800 mr-3" />
                    Priezvisko:
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="border rounded px-2 py-1 mt-1 w-full"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="flex items-center text-lg font-bold">
                    <FaPhone className="text-gray-800 mr-3" />
                    Telefón:
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="border rounded px-2 py-1 mt-1 w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-lg font-bold">
                    <FaEnvelope className="text-gray-800 mr-3" />
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="border rounded px-2 py-1 mt-1 w-full"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 flex flex-col items-center md:flex-row md:space-y-0 md:space-x-4 md:justify-center">
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Aktualizovať
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
              >
                Zmazať
              </button>

              {/* Modálne okno */}
              {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Ste si istý, že chcete zmazať túto prácu?
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Po zmazaní už nebude možné túto akciu vrátiť späť.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                      >
                        Zrušiť
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Zmazať
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="md:mt-0 md:flex md:justify-center">
              <Link
                to="/moje-prace"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
              >
                Späť na moje práce
              </Link>
            </div>
          </div>
        </form>
        <div className="border-t-2 border-gray-300 pt-6 mt-6">
          {/* Navigation Tabs */}
          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row justify-center mb-6 space-y-2 sm:space-y-0 sm:space-x-2">
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
          {selectedTab === "comments" && <Comments jobId={id} />}

          {selectedTab === "photos" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Fotky práce
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.length > 0 ? (
                  photos.map((photo) => (
                    <div
                      key={photo.filename}
                      className="relative group flex flex-col items-center"
                    >
                      <img
                        src={`${
                          import.meta.env.VITE_APP_API_URL
                        }/job_pictures/${photo.filename}`}
                        alt="Práca"
                        className="w-full h-40 sm:h-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => handlePhotoDelete(photo.filename)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Odstrániť fotku"
                      >
                        X
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center col-span-2 sm:col-span-3">
                    Žiadne fotky zatiaľ nepridané.
                  </p>
                )}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 text-center">
                  Pridať novú fotku
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center mt-2 gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPhoto(e.target.files[0])}
                    className="border border-gray-300 rounded-lg p-1 w-48 sm:w-72 text-sm"
                  />
                  <button
                    onClick={handlePhotoUpload}
                    disabled={loading || !newPhoto}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Nahrávam..." : "Pridať fotku"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-10 border-t-2 border-gray-300 pt-6 ">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Pridelení používatelia
          </h2>
          {confirmedUsers.length > 0 ? (
            <div className="space-y-4">
              {confirmedUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="cursor-pointer flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg bg-green-200"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar
                      name={`${user.firstName} ${user.lastName}`}
                      size="40"
                      round={true}
                    />
                    <div>
                      <p className="text-lg font-bold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-600">{user.phone}</p>
                    </div>
                    
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-800">
                      Potvrdeny uzivatel
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Zatiaľ ste nepotvrdili žiadneho pracovníka.
            </p>
          )}
          {showOtherUsers && otherUsers.length > 0 && (
            <div className="space-y-4 mt-4">
              {otherUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="cursor-pointer flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar
                      name={`${user.firstName} {user.lastName}`}
                      size="40"
                      round={true}
                    />
                    <div>
                      <p className="text-lg font-bold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-600">{user.phone}</p>
                      <p className="text-sm text-black mt-1">
          Navrhnutý termín práce:{" "}
          {job.proposedDate
            ? new Date(job.proposedDate).toLocaleDateString("sk-SK")
            : "N/A"}{" "}
          {job.proposedTime ? job.proposedTime : "N/A"}
        </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-800">
                      Čakajúci na potvrdenie
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-10 border-t-2 border-gray-300 pt-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Potvrdenie o ukončení práce
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Potvrdenie od Pracovníka
              </h2>
              {job.workerConfirmed && job.workerConfirmed.confirmed ? (
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
                    <strong>Komentár: </strong>
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
                      <strong>Čas práce:</strong> {job.workerConfirmed.workTime}
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
                Vaše Potvrdenie
              </h2>
              {job.creatorConfirmed && job.creatorConfirmed.confirmed ? (
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
                    <strong>Komentár: </strong>
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
                    <p className="mr-2">
                      <strong>Rating:</strong>
                    </p>
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
                    <p className="mr-2">
                      <strong>Rating:</strong>
                    </p>
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
          {!job.creatorConfirmed.confirmed && confirmedUsers.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => confirmByCreator(confirmedUsers[0])}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Potvrdiť prácu
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmByCreator
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        job={job}
        worker={selectedWorker}
        onConfirm={handleCreatorConfirm}
        jobId={jobId}
      />
    </div>
  );
};

export default MyJobDetail;
