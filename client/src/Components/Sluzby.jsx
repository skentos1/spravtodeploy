import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './styles.css'; // Create and import a CSS file for transitions
import jakub from '../assets/Jakub.jpg';
import petra from '../assets/Petra.jpg';
import marek from '../assets/Marek.jpg';
import { useNavigate } from 'react-router-dom';

const profiles = [
  {
    img: jakub,
    name: 'Marek',
    job: 'Kosenie trávy',
    description: 'Ahoj moje meno je Marek a som student vysokej skoly, rad by som si privyrobil pomocnymi pracami ako je kosenie a zahradne prace.',
    cena: '10€',
  },
  {
    img: marek,
    name: 'Jakub',
    job: 'Stavebné práce',
    description: 'Volam sa Jakub, studujem na strednej odbornej skole, rucne prace mi vobec nie su cudzie a rad by som Vam vypomohol.',
    cena: '15€',
  },
  {
    img: petra,
    name: 'Katka',
    job: 'Strazenie deti',
    description: 'Ahojte, som Katka mam 19 rokov, vo volnom case sa venujem animatorstvu a rada travim cas s detmi, preto Vam ich milo rada postrazim.',
    cena: '6€',
  },
];

const Services = () => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const navigate = useNavigate();

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleClick = () => {
    navigate('/o-nas');
  };

  return (
    <div className="flex justify-center w-full bg-gray-100 py-12">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row min-h-screen pt-12 px-4">
        {/* Text Section */}
        <div className="lg:w-1/2 w-full text-center lg:text-left mb-8 lg:mb-0 border-t pt-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 pt-2">
            Máš naopak príliš voľného času a chcel by si si privyrobiť a pomôcť ostatným?
          </h1>
          <div className='flex justify-center items-center mt-24'>
            <button className='bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800'>
              Ponukni Sluzbu
            </button>
          </div>
          <p
            className="text-lg py-4 text-gray-700 flex justify-center hover:text-blue-500 cursor-pointer transition duration-300"
            onClick={handleClick}
          >
            Informuj sa o vytvarani prac tu.
          </p>
        </div>

        {/* Profiles Section */}
        <div className="lg:w-1/2 w-full space-y-4 border-t pt-6">
          {profiles.map((profile, index) => {
            const isExpanded = expandedIndex === index;
            const animationProps = useSpring({
              maxHeight: isExpanded ? 200 : 0,
              opacity: isExpanded ? 1 : 0,
              overflow: 'hidden',
              config: { tension: 220, friction: 20 },
            });

            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center cursor-pointer p-4 hover:bg-gray-200"
                  onClick={() => toggleExpand(index)}
                >
                  <img
                    className="w-10 h-10 object-cover rounded-full ml-4"
                    src={profile.img}
                    alt={profile.name}
                  />
                  <div className="flex-1 px-2">
                    <h2 className="text-lg font-bold">{profile.name}</h2>
                    <p className="text-xs">{profile.job}</p>
                  </div>
                  <div className="text-gray-500">
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>
                <animated.div style={animationProps} className="bg-gray-50 p-4">
                  <p>{profile.description}</p>
                  <h1 className='text-xl font-semibold pt-3'>{profile.cena}</h1>
                </animated.div>
              </div>
            );
          })}
        </div>
        
      </div>
      
    </div>
  );
};

export default Services;
