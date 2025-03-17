import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { FaStar, FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import useWindowSize from "./useWindowSize";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const MyAccount = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [psc, setPsc] = useState("");
  const [iban, setIban] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [ibanError, setIbanError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const size = useWindowSize();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setUser(result.user);
          setStatistics(result.statistics);
          setPhone(result.user.phone || "");
          setAddress(result.user.address || "");
          setCity(result.user.city || "");
          setPsc(result.user.psc || "");
          setIban(result.user.iban || "");
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("Nepodarilo sa načítať údaje používateľa");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const validateIban = (iban) => {
    const ibanRegex = /^SK\d{22}$/; // Regex to match Slovak IBAN format
    return ibanRegex.test(iban);
  };

  const handleUpdateProfile = async () => {
    // Validate IBAN before submitting
    if (!validateIban(iban)) {
      setIbanError(
        "IBAN musí byť v tvare SK s 22 číslami, napr. SK6109000000005196856064"
      );
      return;
    }

    // Validate phone number
    const phoneNumber = parsePhoneNumberFromString("+" + phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      setPhoneError("Prosím zadajte platné telefónne číslo");
      return;
    }
    setPhoneError("");

    console.log("iban:", { iban });
    console.log("cislo:", { phone });
    setIbanError(""); // Clear the error if validation passes
    const formData = new FormData();
    formData.append("phone", "+" + phone); // Include '+' sign
    formData.append("address", address);
    formData.append("city", city);
    formData.append("psc", psc);
    formData.append("iban", iban);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/auth/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setUser(result.user);
        toast.success("Profil bol úspešne aktualizovaný");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Aktualizácia profilu zlyhala");
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        Načítavanie...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        Chyba: {error}
      </div>
    );

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-4 bg-gray-100 flex flex-col items-center">
      <Toaster />
      <div className="w-full max-w-full xl:max-w-screen-2xl 2xl:max-w-screen-3xl">
        <div className="bg-gray-800 text-white shadow-lg p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Všeobecné informácie
          </h2>
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                {user.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL}${user.avatar}`}
                    alt="Avatar"
                    className="rounded-full w-40 h-40 mb-4 border-2 border-gray-400 object-cover"
                  />
                ) : (
                  <div className="rounded-full w-40 h-40 mb-4 border-2 border-gray-400 flex items-center justify-center bg-green-700 text-white text-6xl">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="mb-4 text-gray-300"
                />
              </div>
              <div>
                <div className="mb-4">
                  <label className="block text-gray-300">Meno</label>
                  <input
                    type="text"
                    value={user.firstName}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Priezvisko</label>
                  <input
                    type="text"
                    value={user.lastName}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Telefón</label>
                  <PhoneInput
                    country={"sk"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    enableSearch={true}
                    searchPlaceholder="Hľadajte krajinu"
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: false,
                    }}
                    inputStyle={{
                      width: "100%",
                      backgroundColor: "#4A5568",
                      border: "1px solid #718096",
                      color: "#E2E8F0",
                      height: "40px",
                    }}
                    buttonStyle={{
                      backgroundColor: "#4A5568",
                      border: "1px solid #718096",
                      color: "#E2E8F0",
                    }}
                  />
                  {phoneError && (
                    <p className="text-red-500 mt-2">{phoneError}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Adresa</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Mesto</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">PSČ</label>
                  <input
                    type="text"
                    value={psc}
                    onChange={(e) => setPsc(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">
                    IBAN
                    <Tooltip title="Prosím uistite sa, že máte nastavený správny IBAN, na tento účet vám prídu peniaze po úspešnom dokončení práce.">
                      <span>
                        <FaInfoCircle className="inline ml-2 text-lg text-gray-300 cursor-pointer" />
                      </span>
                    </Tooltip>
                  </label>
                  <input
                    type="text"
                    value={iban}
                    placeholder="Napr. SK8975000000000012345671"
                    onChange={(e) => setIban(e.target.value)}
                    className={`w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600 ${
                      ibanError ? "border-red-500" : ""
                    }`}
                  />
                  {ibanError && (
                    <p className="text-red-500 mt-2">{ibanError}</p>
                  )}
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Aktualizovať profil
                </button>
                {(!phone || !iban) && (
                  <div className="text-red-500 mt-4">
                    Prosím, doplňte svoje telefónne číslo, adresu a IBAN vo svojom
                    profile.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 text-white shadow-lg p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Štatistiky prác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
            <div className="text-white">
              <p className="font-bold">Počet prác</p>
              <p>{statistics.totalJobs}</p>
            </div>
            <div className="text-white">
              <p className="font-bold">Priemerné hodnotenie</p>
              <div className="flex items-center">
                <ReactStars
                  count={5}
                  value={statistics.averageRating}
                  edit={false}
                  size={24}
                  activeColor="#ffd700"
                />
                <span className="ml-2 text-lg text-gray-300">
                  {statistics.averageRating?.toFixed(1)}/5
                </span>
              </div>
            </div>
            <div className="text-white">
              <p className="font-bold">Úspešné práce</p>
              <p>{statistics.completedJobs}</p>
            </div>
            <div className="text-white">
              <p className="font-bold">Neúspešné práce</p>
              <p>{statistics.canceledJobs}</p>
            </div>
            <div className="text-white">
              <p className="font-bold">Sporné práce</p>
              <p>{statistics.disputeJobs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
