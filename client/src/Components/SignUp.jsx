import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../App.css";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  console.log(import.meta.env.VITE_APP_API_URL);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Neplatný formát emailu");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Heslo musí obsahovať minimálne 8 znakov, veľké písmeno, malé písmeno a číslo"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Heslá sa nezhodujú");
      return;
    }

    if (!agreedToTerms) {
      toast.error(
        "Musíte súhlasiť s podmienkami a zásadami ochrany osobných údajov"
      );
      return;
    }
    Axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/signup`, {
      firstName,
      lastName,
      email,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success("Registrácia prebehla úspešne. Prosím, prihláste sa.");
          setTimeout(() => {
            navigate("/login");
          }, 3000); // Navigate to login after 3 seconds
        } else {
          toast.error(response.data.message || "Registrácia zlyhala");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Nastala chyba. Skúste to znova.");
      });
  };

  return (
    <div className="sign-up-container flex items-center justify-center min-h-screen p-4 text-black">
      <div>
        <Toaster />
      </div>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-black border-opacity-30 p-8 shadow-lg w-full max-w-lg md:max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-black text-center">
            Registrácia
          </h2>

          <div className="relative">
            <input
              type="text"
              id="firstName"
              className="block w-full p-4 bg-transparent border-b-2 border-black placeholder-black focus:outline-none focus:border-blue-500 text-black"
              placeholder="Meno"
              required
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              id="lastName"
              className="block w-full p-4 bg-transparent border-b-2 border-black placeholder-black focus:outline-none focus:border-blue-500 text-black"
              placeholder="Priezvisko"
              required
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              className="block w-full p-4 bg-transparent border-b-2 border-black placeholder-black focus:outline-none focus:border-blue-500 text-black"
              placeholder="Email"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              className="block w-full p-4 bg-transparent border-b-2 border-black placeholder-black focus:outline-none focus:border-blue-500 text-black"
              placeholder="Heslo"
              required
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
            <small className="block text-gray-500 mt-1">
              Heslo musí obsahovať minimálne 8 znakov, veľké písmeno, malé
              písmeno a číslo.
            </small>
          </div>

          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              className="block w-full p-4 bg-transparent border-b-2 border-black placeholder-black focus:outline-none focus:border-blue-500 text-black"
              placeholder="Zopakujte heslo"
              required
              autoComplete="off"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="agreedToTerms"
              className="mr-2"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="agreedToTerms" className="text-black">
              Súhlasím s{" "}
              <Link
                to="/podmienky-sluzby"
                className="text-black underline hover:text-blue-500"
              >
                podmienkami
              </Link>{" "}
              a{" "}
              <Link
                to="/zasady-ochrany-osobnych-udajov"
                className="text-black underline hover:text-blue-500"
              >
                zásadami ochrany osobných údajov
              </Link>
            </label>
          </div>

          <button
            className="w-full py-2 bg-white text-black font-bold rounded-full hover:bg-blue-700 transition-colors duration-300"
            type="submit"
          >
            Zaregistrovať sa
          </button>

          <p className="text-center text-black">
            Už máte účet?{" "}
            <Link to="/login" className="font-semibold hover:underline">
              Prihlásiť sa
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
