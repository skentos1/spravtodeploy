import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import CityAutocomplete from "./CityAutocomplete";
import DistrictAutocomplete from "./DistrictAutocomplete";
import toast from "react-hot-toast";

const CreateJob = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    estimatedTime: "",
    address: "",
    city: "",
    district: "",
    price: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    description: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !toastShownRef.current) {
      navigate("/login");
      toast.error("Pre vytvorenie práce musíte byť prihlásený");
      toastShownRef.current = true;
    }
  }, [loading, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? Array.from(files) : value,
    });
  };

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Toto pole je povinné";
        if (!formData.category.trim())
          newErrors.category = "Toto pole je povinné";
        if (!formData.estimatedTime.trim())
          newErrors.estimatedTime = "Toto pole je povinné";
        if (!formData.price.trim()) newErrors.price = "Toto pole je povinné";
        break;
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.firstName.trim())
          newErrors.firstName = "Toto pole je povinné";
        if (!formData.lastName.trim())
          newErrors.lastName = "Toto pole je povinné";
        if (!formData.phoneNumber.trim())
          newErrors.phoneNumber = "Toto pole je povinné";
        if (!formData.email.trim()) newErrors.email = "Toto pole je povinné";
        if (formData.email.trim() && !emailRegex.test(formData.email))
          newErrors.email = "Nesprávny formát emailu";
        break;
      case 3:
        if (!formData.city.trim()) newErrors.city = "Toto pole je povinné";
        if (!formData.district.trim())
          newErrors.district = "Toto pole je povinné";
        if (!formData.address.trim())
          newErrors.address = "Toto pole je povinné";
        if (formData.description.trim().length < 20)
          newErrors.description = "Popis musí obsahovať aspoň 20 znakov";
        if (!formData.acceptTerms)
          newErrors.acceptTerms = "Musíte súhlasiť s podmienkami";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      toast.error("Prosím vyplňte všetky povinné polia.");
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      toast.error("Prosím vyplňte všetky povinné polia.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Pridajte textové polia
      Object.keys(formData).forEach((key) => {
        if (key !== "jobPhotos") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Pridajte jednotlivé fotky
      if (formData.jobPhotos && formData.jobPhotos.length > 0) {
        formData.jobPhotos.forEach((file) => {
          formDataToSend.append("photos", file);
        });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/jobs/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Job created:", response.data);
      navigate("/job-success", { state: { job: response.data.job } });
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Nepodarilo sa vytvoriť prácu.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

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

  return (
    <div className="w-full min-h-screen py-8 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Vytvoriť Prácu
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Názov:
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.title && <p className="text-red-600">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Kategória:
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">Vyberte kategóriu</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600">{errors.category}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Odhadovaný Čas (hodiny):
                </label>
                <input
                  type="number"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.estimatedTime && (
                  <p className="text-red-600">{errors.estimatedTime}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Cena (€):
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.price && <p className="text-red-600">{errors.price}</p>}
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ďalší krok
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Meno:
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.firstName && (
                  <p className="text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Priezvisko:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.lastName && (
                  <p className="text-red-600">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Telefónne číslo:
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  E-mail:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ďalší krok
              </button>
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mt-2"
              >
                Predchádzajúci krok
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Mesto:
                </label>
                <CityAutocomplete
                  value={formData.city}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      city: value.city,
                      district: value.district,
                    })
                  }
                />
                {errors.city && <p className="text-red-600">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Okres:
                </label>
                <DistrictAutocomplete
                  value={formData.district}
                  onChange={(value) =>
                    setFormData({ ...formData, district: value })
                  }
                />
                {errors.district && (
                  <p className="text-red-600">{errors.district}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Adresa:
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.address && (
                  <p className="text-red-600">{errors.address}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Popis:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Napr: Potrebujem pokosiť trávnik, najlepšie do 12.8. Preferoval by som popoludní."
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                ></textarea>
                {errors.description && (
                  <p className="text-red-600">{errors.description}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Pridať fotku (nepovinné):
                </label>
                <input
                  type="file"
                  name="jobPhoto"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Pridajte fotku do poľa `jobPhotos`
                      setFormData({
                        ...formData,
                        jobPhotos: [...(formData.jobPhotos || []), file],
                      });
                    }
                  }}
                  className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                {/* Náhľady fotiek */}
                {formData.jobPhotos && formData.jobPhotos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-700 font-semibold">
                      Náhľad fotiek:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {formData.jobPhotos.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                jobPhotos: formData.jobPhotos.filter(
                                  (_, i) => i !== index
                                ),
                              })
                            }
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mr-2"
                    required
                  />
                  Súhlasím s podmienkami
                </label>
                {errors.acceptTerms && (
                  <p className="text-red-600">{errors.acceptTerms}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Vytvoriť prácu
              </button>
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mt-2"
              >
                Predchádzajúci krok
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
