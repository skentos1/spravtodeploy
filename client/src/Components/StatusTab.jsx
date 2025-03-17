import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import uspesna from '../assets/uspesna.jpg';
import neuspesna from '../assets/neuspesna.jpg';
import konfliktna from '../assets/konfliktna.jpg';

const statuses = [
    {
        title: 'Práca úspešne dokončená',
        description: 'Práca nadobúda stav úspešne dokončenej ak obe strany potvrdia, že práca bola úspešne dokončená. V tomto momente sa uvoľnia peniaze z platobného úmyslu a pošlú sa pracovníkovi na účet.',
        img: uspesna,
        imgAlt: 'Status 1 Illustration',
        icon: <FaCheckCircle className="text-green-500" />
    },
    {
        title: 'Práca neúspešne dokončená',
        description: 'Práca nadobúda stav neúspešne dokončenej ak obe strany potvrdia, že práca bola neúspešne dokončená. V tomto momente sa platobný úmysel zruší a peniaze budú vrátene Tvorcovi práce späť na jeho účet.',
        img: neuspesna,
        imgAlt: 'Status 2 Illustration',
        icon: <FaTimesCircle className="text-red-500" />
    },
    {
        title: 'Práca v spore',
        description: 'Práca nadobudne status v spore vtedy, ak sa potvrdenia práce z oboch strán nezhodujú. To znamená, že tvorca práce potvrdil Prácu ako neúspešnú a pracovník ako úspešnú a naopak. V tomto prípade, budú obaja používatelia kontaktovaní naším Admin Tímom, a prešetria tento konflikt o potvrdení práce a následne manuálne ustanovia Stav Práce.',
        img: konfliktna,
        imgAlt: 'Status 3 Illustration',
        icon: <FaExclamationCircle className="text-yellow-500" />
    },
];

const StatusTabs = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="bg-white py-16 w-full flex flex-col items-center">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-green-500 text-sm font-semibold tracking-wide uppercase">Statusy Práce</h2>
                <h1 className="text-3xl font-extrabold text-gray-800 mt-2 mb-8">
                    Prehľad Statusov Práce
                </h1>

                <div className="flex flex-col items-center">
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {statuses.map((status, index) => (
                            <button
                                key={index}
                                className={`flex items-center gap-2 px-2 py-1 text-xs sm:text-sm md:px-4 md:py-2 border-b-2 ${
                                    activeTab === index
                                        ? 'text-green-500 border-green-500'
                                        : 'text-gray-500 border-transparent hover:text-green-500 hover:border-green-500'
                                } transition duration-200 ease-in-out`}
                                onClick={() => setActiveTab(index)}
                                aria-selected={activeTab === index}
                                role="tab"
                                tabIndex={activeTab === index ? 0 : -1}
                            >
                                {status.icon}
                                {status.title}
                            </button>
                        ))}
                    </div>

                    <div className="w-full" role="tabpanel">
                        {statuses.map((status, index) => (
                            <div
                                key={index}
                                className={`${activeTab === index ? 'block' : 'hidden'}`}
                                id={`tabpanel-${index}`}
                                aria-labelledby={`tab-${index}`}
                            >
                                <div className="flex flex-col items-center mb-12 w-full">
                                    <div className="w-full p-4 flex justify-center">
                                        <div className="w-full sm:w-3/4 lg:w-2/3 h-auto bg-gray-100 rounded-lg shadow-lg p-6">
                                            <img
                                                src={status.img}
                                                alt={status.imgAlt}
                                                className="rounded-lg shadow-md w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-left w-full p-4 flex justify-center">
                                        <div className="w-full sm:w-3/4 lg:w-2/3">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center sm:text-left">
                                                {status.title}
                                            </h3>
                                            <p className="text-gray-500 text-base mb-6 text-center sm:text-left">
                                                {status.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusTabs;
