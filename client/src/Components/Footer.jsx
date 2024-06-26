import React from 'react';
import logo from '../assets/HM.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center py-6 border-t border-gray-200">
      <div className="flex justify-between items-start w-full max-w-screen-lg px-4 mb-4">
        <div className="flex items-center">
          <img src={logo} alt="HodinovyManzel Logo" className="h-10 mr-2" />
          <span className="font-bold text-xl">HodinovyManzel</span>
        </div>
        <div className="flex flex-col">
          <a href="terms_of_service_link" className="text-gray-600 hover:text-gray-900 text-sm">Podmienky služby</a>
          <a href="privacy_policy_link" className="text-gray-600 hover:text-gray-900 text-sm">Zásady ochrany osobných údajov</a>
        </div>
        <div className="flex space-x-4">
          <a href="instagram_link" className="text-gray-600 hover:text-gray-900">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="facebook_link" className="text-gray-600 hover:text-gray-900">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="linkedin_link" className="text-gray-600 hover:text-gray-900">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="github_link" className="text-gray-600 hover:text-gray-900">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="youtube_link" className="text-gray-600 hover:text-gray-900">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
      <div className="text-gray-600 text-xs">
        &copy; 2024 HodinovyManzel Inc. Všetky práva vyhradené. HodinovyManzel je registrovaná ochranná známka HodinovyManzel Inc.
      </div>
    </footer>
  );
};

export default Footer;
