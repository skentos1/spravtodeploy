import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavodJob from './NavodJob';
import NavodWorker from './NavodWorker';

const HowItWorks = () => {
    const [selectedButton, setSelectedButton] = useState('create');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
        });
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-8"
            onMouseMove={handleMouseMove}
        >
            <div className="relative bg-gray-100 text-center p-8 sm:p-16 rounded-3xl shadow-xl max-w-6xl w-full mx-2 my-8 sm:my-16" style={{ marginLeft: '10px', marginRight: '10px' }}>
                {/* Decorative Lines and Dots */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <svg width="100%" height="100%">
                        <circle
                            cx="10%"
                            cy="20%"
                            r="5"
                            fill="#00b894"
                            style={{
                                transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`,
                                transition: 'transform 0.1s',
                            }}
                        />
                        <circle
                            cx="90%"
                            cy="30%"
                            r="5"
                            fill="#0984e3"
                            style={{
                                transform: `translate(${mousePosition.x * -50}px, ${mousePosition.y * -50}px)`,
                                transition: 'transform 0.1s',
                            }}
                        />
                        <circle
                            cx="50%"
                            cy="90%"
                            r="5"
                            fill="#fdcb6e"
                            style={{
                                transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * -50}px)`,
                                transition: 'transform 0.1s',
                            }}
                        />
                        <path
                            d="M 10% 80 Q 50% 60, 90% 80"
                            stroke="#dfe6e9"
                            strokeWidth="2"
                            fill="transparent"
                            style={{
                                transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                                transition: 'transform 0.1s',
                            }}
                        />
                    </svg>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-800 my-8 sm:my-12 leading-tight relative z-10">
                    Zisti ako to funguje
                    <br />
                    <span className="text-gray-600">veľmi rýchlo a jednoducho</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-12 leading-relaxed relative z-10">
                    Zvoľ si aká funkcia ťa zaujíma, či chceš vytvoriť prácu alebo sa na ňu prihlásiť.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 my-8 sm:my-12 relative z-10">
                    <button
                        className={`px-6 sm:px-10 py-3 sm:py-4 font-semibold rounded-full shadow-md transform transition-all duration-300 ${
                            selectedButton === 'create'
                                ? 'bg-gray-800 text-white'
                                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                        onClick={() => handleButtonClick('create')}
                    >
                        Vytvorenie práce
                    </button>
                    <button
                        className={`px-6 sm:px-10 py-3 sm:py-4 font-semibold rounded-full shadow-md transform transition-all duration-300 ${
                            selectedButton === 'apply'
                                ? 'bg-gray-800 text-white'
                                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                        onClick={() => handleButtonClick('apply')}
                    >
                        Prihlásenie sa na prácu
                    </button>
                </div>
            </div>
            {selectedButton === 'create' && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full flex justify-center"
                >
                    <NavodJob />
                </motion.div>
            )}
            {selectedButton === 'apply' && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full flex justify-center"
                >
                    <NavodWorker />
                </motion.div>
            )}
        </div>
    );
};

export default HowItWorks;
