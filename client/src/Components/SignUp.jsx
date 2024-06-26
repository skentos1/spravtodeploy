import React, { useState } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    Axios.post("http://localhost:3000/auth/signup", { firstName, lastName, email, password })
      .then(response => {
        if (response.data.status) {
          navigate('/login');
        } else {
          setError(response.data.message || 'Registration failedasdas');
        }
      })
      .catch(err => {
        console.log(err);
        setError('An error occurred. Please try again.');
      });
  };

  return (
    <div className="sign-up-container flex items-center justify-center min-h-screen p-4 text-black">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-black border-opacity-30 p-8 shadow-lg w-full max-w-lg md:max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-black text-center">Registrácia</h2>
          
          {error && <p className="text-red-500 text-center">{error}</p>}

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
            <label htmlFor="agreedToTerms" className="text-black">Súhlasím s podmienkami</label>
          </div>

          <button className="w-full py-2 bg-white text-black font-bold rounded-full hover:bg-blue-700 transition-colors duration-300" type="submit">Zaregistrovať sa</button>

          <p className="text-center text-black">
            Už máte účet? <Link to="/login" className="font-semibold hover:underline">Prihlásiť sa</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
