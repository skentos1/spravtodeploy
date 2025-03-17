import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../App.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Heslá sa nezhodujú");
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error("Heslo musí obsahovať minimálne 8 znakov, jedno veľké písmeno a číslo");
      return;
    }

    axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/reset-password/${token}`, { password })
      .then(response => {
        if (response.data.status) {
          toast.success("Heslo bolo zmenené");
          navigate("/login");
        } else {
          toast.error(response.data.message || "Zmena hesla zlyhala");
        }
      }).catch(err => {
        console.log(err);
        toast.error("Nastala chyba. Skúste to znova.");
      });
  };

  return (
    <div className="sign-up-container flex items-center justify-center min-h-screen">
      <div><Toaster /></div>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-30 p-8 shadow-lg max-w-md w-full">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-black text-center">Resetujte si heslo</h2>
          
          <div className="relative">
            <input
              type="password"
              id="password"
              className="block w-full p-4 bg-transparent border-b-2 border-black placeholder-black focus:outline-none focus:border-blue-500 text-black"
              placeholder="Nové heslo"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              className="block w-full p-4 bg-transparent border-b-2 border-black placeholder-black focus:outline-none focus:border-blue-500 text-black"
              placeholder="Potvrďte nové heslo"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="w-full py-2 bg-white text-black font-bold rounded-full hover:bg-blue-700 transition-colors duration-300" type="submit">Reset</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
