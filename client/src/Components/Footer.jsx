import React from "react";
import logo from "../assets/HM.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center py-6 border-t border-gray-200">
      <div className="w-full max-w-screen-lg px-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="flex items-center mb-4 md:mb-0">
            <img src={logo} alt="HodinovyManzel Logo" className="h-10 mr-2" />
            <span className="font-bold text-xl">SpravToZaMňa</span>
          </div>
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <Link
              to="/podmienky-sluzby"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Podmienky služby
            </Link>
            <Link
              to="/zasady-ochrany-osobnych-udajov"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Zásady ochrany osobných údajov
            </Link>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/s.kentos/"
              className="text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="facebook_link"
              className="text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="linkedin_link"
              className="text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-gray-600 text-xs text-center">
        &copy; 2024 SpravToZaMňa. Všetky práva vyhradené.
      </div>
      <div className="text-gray-500 text-xs text-center">
        Vytvoril Simon Kentoš
      </div>
    </footer>
  );
};

export default Footer;
