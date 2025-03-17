import React, { useState } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust path if needed
import toast, { Toaster } from 'react-hot-toast';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, { email, password }, { withCredentials: true });
      console.log(response.data); // Log the response
      if (response.data.token) {
        login(response.data.token); // Call login to set user state
        toast.success('Prihlásenie prebehlo úspešne.');
        navigate('/'); // Redirect to the homepage
      } else {
        toast.error(response.data.message || 'Prihlásenie zlyhalo.');
      }
    } catch (err) {
      console.log(err);
      toast.error('Nastala chyba. Skúste to znova.');
    }
  };

  return (
    <div className="sign-up-container flex items-center justify-center min-h-screen mt-[-50px]">  {/* Adjust the mt value as needed */}
      <div><Toaster /></div>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-30 p-8 shadow-lg max-w-md w-full">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-black text-center">Prihlásiť sa</h2>

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
          </div>

          <button className="w-full py-2 bg-white text-black font-bold rounded-full hover:bg-blue-700 transition-colors duration-300" type="submit">Prihlásiť sa</button>
          <div className="flex justify-between text-white text-sm">
            <Link to="/forgot-password" className="hover:underline font-bold text-black text-base">Zabudnuté heslo?</Link>
          </div>

          <p className="text-center text-black">
            Nemáte účet? <Link to="/sign-up" className="font-semibold hover:underline">Zaregistrujte sa</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
