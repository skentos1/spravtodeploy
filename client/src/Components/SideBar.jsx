import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white h-full p-4">
      <h2 className="text-2xl font-bold mb-8">MENU</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/moj-profil" className="cursor-pointer hover:text-gray-300">
            Môj Profil
          </Link>
        </li>
        <li>
          <Link to="/moje-prace" className="cursor-pointer hover:text-gray-300">
            Vytvorené práce
          </Link>
        </li>
        <li>
          <Link to="/prihlasene-prace" className="cursor-pointer hover:text-gray-300">
            Prihlásené Práce
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
