import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import banner from '../assets/about-us.jpg';
import inovative from '../assets/inovative.jpg';
import old from '../assets/postni3.jpg';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const AboutUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/contact`, formData);
      toast.success('Vaša správa bola úspešne odoslaná!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error('Pri odosielaní vašej správy došlo k chybe. Skúste to prosím znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [bannerRef, bannerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [helpRef, helpInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="bg-white min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: -50 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md"
      >
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 text-center leading-tight">
            Snažíme sa Vám zlepšovať <br />
            <span className="text-4xl mt-2 text-gray-600">Vaše každodenné životy.</span>
          </h1>
        </div>
      </motion.header>
      <main>
        <motion.div
          ref={bannerRef}
          initial={{ opacity: 0 }}
          animate={bannerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative w-full h-96 bg-white shadow-md overflow-hidden"
        >
          <img src={banner} alt="Team meeting" className="w-full h-full object-cover" />
          <div className="absolute bottom-4 right-4">
            <p className="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">Váš SpravToZaMna tím</p>
          </div>
        </motion.div>
        <section ref={missionRef} className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={missionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-start">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Naša Misia
              </h2>
              <h3 className="text-xl font-semibold text-gray-700 mt-4">
                Inovácie pre každodenný život
              </h3>
            </div>
            <div className="mt-10 lg:flex lg:space-x-8">
              <div className="lg:w-1/2">
                <p className="text-base text-gray-600">
                  Naším cieľom bolo priniesť niečo jedinečné, čo na Slovensku ešte neexistovalo, no malo by to skutočný význam pre ľudí. Chceli sme vytvoriť riešenia, ktoré by zlepšili každodenný život bežného človeka v rôznych aspektoch.
                </p>
                <p className="mt-4 text-base text-gray-600">
                  Veríme v inovatívne prístupy a technológie, ktoré môžu uľahčiť život a zefektívniť každodenné činnosti. Naša misia je prinášať hodnotu a pozitívne zmeny pre všetkých našich zákazníkov.
                </p>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2 lg:-mt-16">
                <div className="grid grid-cols-1 gap-4">
                  <img src={inovative} alt="Team collaboration" className="w-full rounded-lg shadow-md object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        <section ref={helpRef} className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={helpInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row lg:space-x-8">
              <div className="lg:w-1/2">
                <img src={old} alt="Service illustration" className="w-full rounded-lg shadow-md object-cover" />
              </div>
              <div className="lg:w-1/2">
                <div className="text-start lg:pl-8">
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Ako Pomáhame
                  </h2>
                  <h3 className="text-xl font-semibold text-gray-700 mt-4">
                    Prepájame ľudí s potrebami a tými, ktorí môžu pomôcť
                  </h3>
                  <p className="mt-4 text-base text-gray-600">
                    Naša platforma umožňuje ľuďom postovať rôzne úlohy a práce, ktoré potrebujú vykonať. Či už ide o pomoc v domácnosti, technickú podporu, alebo špeciálne projekty...
                  </p>
                  <p className="mt-4 text-base text-gray-600">
                    Myslíme aj na starších ľudí, ktorí často potrebujú asistenciu pri každodenných úlohách. Naša platforma im umožňuje jednoducho nájsť spoľahlivú pomoc v ich okolí.
                  </p>
                  <p className="mt-4 text-base text-gray-600">
                    Zároveň ponúkame mladým ľuďom skvelú príležitosť na privyrobenie si a získanie nových skúseností. Práca cez našu platformu im umožňuje flexibilitu a šancu rozšíriť svoje zručnosti, pričom zároveň pomáhajú komunite.
                  </p>
                  <p className="mt-4 text-base text-gray-600">
                    Našim cieľom je vytvoriť komunitu, kde každý môže nájsť podporu a možnosti na zlepšenie svojho života. 
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        <section ref={formRef} className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Máte nejakú otázku?</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Krstné meno
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="first-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Priezvisko
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="last-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefón
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Správa
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                >
                  {isSubmitting ? 'Odosielanie...' : 'Odoslať'}
                </button>
              </div>
            </form>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
