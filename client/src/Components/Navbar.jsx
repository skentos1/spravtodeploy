import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineMenu, AiOutlineUser } from "react-icons/ai";
import { FaRegAddressCard, FaBriefcase, FaUserCheck } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/HM.jpg";
import { useAuth } from "./AuthContext";
import axios from "axios";

const Navbar = ({ onSidebarSelect }) => {
  const [nav, setNav] = useState(false);
  const [navbarDropdownOpen, setNavbarDropdownOpen] = useState(false);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated, logout } = useAuth();
  const [userRole, setUserRole] = useState("");
  const sidebarRef = useRef(null);
  const [creatorActivityCount, setCreatorActivityCount] = useState(0);
  const [workerActivityCount, setWorkerActivityCount] = useState(0);
  const [accountNotificationsCount, setAccountNotificationsCount] = useState(0);

  useEffect(() => {
    setNavbarDropdownOpen(false);
    setSidebarDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  //Príklad, ako by si mohol volať fetchProfile každých 30 sekúnd:
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        fetchProfile();
      }
    }, 30000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      // 1) Najprv načítame usera
      const userRes = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/users/me`,
        { withCredentials: true }
      );
      const { user } = userRes.data;
      setProfileComplete(!!user.phone && !!user.iban);

      // 2) Načítame jobs summary (napr. custom endpoint /jobs/summary)
      const summaryRes = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/jobs/summary`,
        {
          withCredentials: true,
        }
      );
      const {
        creatorActivityCount,
        workerActivityCount,
        accountNotificationsCount,
      } = summaryRes.data;

      setCreatorActivityCount(creatorActivityCount);
      setWorkerActivityCount(workerActivityCount);
      setAccountNotificationsCount(accountNotificationsCount);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const handleNav = () => {
    setNav(!nav);
    setSidebarDropdownOpen(false); // Close sidebar dropdown if sidebar is toggled
  };

  const handleLinkClick = () => {
    setNav(false);
    setSidebarDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleNavbarDropdownToggle = () => {
    setNavbarDropdownOpen(!navbarDropdownOpen);
    setSidebarDropdownOpen(false); // Close sidebar dropdown if navbar dropdown is toggled
  };

  const handleSidebarDropdownToggle = () => {
    setSidebarDropdownOpen(!sidebarDropdownOpen);
    setNavbarDropdownOpen(false); // Close navbar dropdown if sidebar dropdown is toggled
  };

  const handleOutsideClick = (e) => {
    if (nav && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setNav(false);
    }
  };

  useEffect(() => {
    if (nav) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [nav]);

  //console.log(accountNotificationsCount)
  //console.log(creatorActivityCount)

  return (
    <div className="flex justify-between items-center h-20 w-full pt-1 px-4 text-black bg-white border-b border-gray-200 font-sans z-50">
      <div className="flex items-center">
        <img src={logo} alt="HodinovyManzel Logo" className="h-14 mr-2" />
        <h1 className="text-xl font-bold">
          <Link to="/">SpravToZaMna</Link>
        </h1>
      </div>

      <ul className="hidden lg:flex space-x-2 flex-grow justify-center">
        <Link
          to="/"
          className="p-2 my-2 text-sm hover:bg-gray-100 rounded-xl"
          onClick={handleLinkClick}
        >
          Domov
        </Link>
        <Link
          to="/prace"
          className="p-2 my-2 text-sm hover:bg-gray-100 rounded-xl"
          onClick={handleLinkClick}
        >
          Ponuka prác
        </Link>
        <Link
          to="/create-job"
          className="p-2 my-2 text-lg bg-black text-white rounded-full font-bold hover:bg-gray-800"
          onClick={handleLinkClick}
        >
          Vytvoriť Prácu
        </Link>
        <Link
          to="/o-nas"
          className="p-2 my-2 text-sm hover:bg-gray-100 rounded-xl"
          onClick={handleLinkClick}
        >
          O nás
        </Link>
        <Link
          to="/ako-fungujeme"
          className="p-2 my-2 text-sm hover:bg-gray-100 rounded-xl"
          onClick={handleLinkClick}
        >
          Ako Fungujeme?
        </Link>
      </ul>

      {/* Desktop right side */}
      <div className="hidden lg:flex space-x-4 items-center">
        {isAuthenticated ? (
          <>
            <div className="relative">
              <button
                onClick={handleNavbarDropdownToggle}
                className="relative text-black text-sm flex items-center hover:bg-gray-200 p-2 rounded-xl"
              >
                <AiOutlineUser size={20} className="mr-2" />
                <span>Môj Účet</span>

                {/* Malá bodka, ak profil nie je kompletne vyplnený */}
                {!profileComplete && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}

                {/* Číselný badge, ak máme nejaké notifikácie */}
                {accountNotificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold transition-transform duration-900
    animate-bounce">
                    {accountNotificationsCount}
                  </span>
                )}
              </button>
              {navbarDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {/* Môj profil */}
                  <span
                    onClick={() => {
                      navigate("/moj-profil");
                      onSidebarSelect("my-account");
                      setNavbarDropdownOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      !profileComplete ? "bg-red-100" : ""
                    }`}
                  >
                    <FaRegAddressCard className="mr-2 inline" /> Môj Profil
                    {!profileComplete && (
                      <span className="text-red-500">*</span>
                    )}
                  </span>
                  {/* Vytvorené práce (notifikačná bodka ak creatorHasActivity) */}
                  {/* Vytvorené práce */}
                  <span
                    onClick={() => {
                      navigate("/moje-prace");
                      onSidebarSelect("moje-prace");
                      setNavbarDropdownOpen(false);
                    }}
                    className="relative block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <FaBriefcase className="mr-2 inline" /> Vytvorené práce
                    {/* Ak existuje aspoň 1 aktivita, zobraz badge s číslom */}
                    {creatorActivityCount > 0 && (
                      <span
                        className="
                          absolute top-2 right-2
                          bg-red-500 text-white text-[10px] font-bold
                          w-5 h-5
                          rounded-full
                          flex items-center justify-center
                        "
                      >
                        {creatorActivityCount}
                      </span>
                    )}
                  </span>

                  {/* Prihlásené práce */}
                  <span
                    onClick={() => {
                      navigate("/prihlasene-prace");
                      onSidebarSelect("prihlasene-prace");
                      setNavbarDropdownOpen(false);
                    }}
                    className="relative block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <FaUserCheck className="mr-2 inline" /> Prihlásené Práce
                    {/* Ak je workerActivityCount > 0, zobraz číselný badge */}
                    {workerActivityCount > 0 && (
                      <span
                        className="
                          absolute top-2 right-2
                          bg-red-500 text-white text-[10px] font-bold
                          w-5 h-5
                          rounded-full
                          flex items-center justify-center
                        "
                      >
                        {workerActivityCount}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-black text-sm text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800"
            >
              Odhlásiť sa
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-black text-sm hover:bg-gray-200 p-2 rounded-xl mx-auto"
            >
              Prihlásiť sa
            </button>
            <button
              onClick={() => navigate("/sign-up")}
              className="bg-black text-sm text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 mx-auto"
            >
              Registrácia
            </button>
          </>
        )}
      </div>

      {/* Mobilné menu */}
      <div className="lg:hidden flex items-center space-x-4">
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={handleNavbarDropdownToggle}
              className="text-black p-2 rounded-xl hover:bg-gray-200"
            >
              <AiOutlineUser size={20} />
              {!profileComplete && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}

{accountNotificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {accountNotificationsCount}
                  </span>
                )}
            </button>
            {navbarDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <span
                  onClick={() => {
                    navigate("/moj-profil");
                    onSidebarSelect("my-account");
                    handleLinkClick();
                    setNavbarDropdownOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                    !profileComplete ? "bg-red-100" : ""
                  }`}
                >
                  <FaRegAddressCard className="mr-2 inline" /> Môj Profil
                  {!profileComplete && <span className="text-red-500">*</span>}
                </span>
                {/* Vytvorené práce */}
                <span
                  onClick={() => {
                    navigate("/moje-prace");
                    onSidebarSelect("moje-prace");
                    setNavbarDropdownOpen(false);
                  }}
                  className="relative block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  <FaBriefcase className="mr-2 inline" /> Vytvorené práce
                  {/* Ak existuje aspoň 1 aktivita, zobraz badge s číslom */}
                  {creatorActivityCount > 0 && (
                    <span
                      className="
                        absolute top-2 right-2
                        bg-red-500 text-white text-[10px] font-bold
                        w-5 h-5
                        rounded-full
                        flex items-center justify-center
                      "
                    >
                      {creatorActivityCount}
                    </span>
                  )}
                </span>

                {/* Prihlásené práce */}
                <span
                  onClick={() => {
                    navigate("/prihlasene-prace");
                    onSidebarSelect("prihlasene-prace");
                    setNavbarDropdownOpen(false);
                  }}
                  className="relative block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  <FaUserCheck className="mr-2 inline" /> Prihlásené Práce
                  {/* Ak je workerActivityCount > 0, zobraz číselný badge */}
                  {workerActivityCount > 0 && (
                    <span
                      className="
                        absolute top-2 right-2
                        bg-red-500 text-white text-[10px] font-bold
                        w-5 h-5
                        rounded-full
                        flex items-center justify-center
                      "
                    >
                      {workerActivityCount}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}
        <div
          onClick={handleNav}
          className="text-black text-sm p-2 rounded-xl hover:bg-gray-200"
        >
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
      </div>
      <div
        ref={sidebarRef}
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-gray-200 bg-white ease-in-out duration-500 z-40"
            : "fixed left-[-100%] ease-in-out duration-500 z-40"
        }
      >
        <ul className="p-4">
          <div className="flex items-center mb-4">
            <img src={logo} alt="HodinovyManzel Logo" className="h-12 mr-2" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">
                <Link to="/" className="text-black no-underline">
                  SpravTo
                </Link>
              </h1>
              <h1 className="text-2xl font-bold">
                <Link to="/" className="text-black no-underline">
                  ZaMňa
                </Link>
              </h1>
            </div>
          </div>
          <li className="border-b border-gray-200">
            <Link
              to="/"
              className="block p-4 hover:bg-gray-200 rounded"
              onClick={handleLinkClick}
            >
              Domov
            </Link>
          </li>
          <li className="border-b border-gray-200">
            <Link
              to="/prace"
              className="block p-4 hover:bg-gray-200 rounded"
              onClick={handleLinkClick}
            >
              Ponuka Prác
            </Link>
          </li>
          <li className="border-b border-gray-200 my-4">
            <Link
              to="/create-job"
              className="block py-6 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-center text-lg"
              onClick={handleLinkClick}
            >
              Vytvoriť Prácu
            </Link>
          </li>
          <li className="border-b border-gray-200">
            <Link
              to="/o-nas"
              className="block p-4 hover:bg-gray-200 rounded"
              onClick={handleLinkClick}
            >
              O nás
            </Link>
          </li>
          <li className="border-b border-gray-200">
            <Link
              to="/ako-fungujeme"
              className="block p-4 hover:bg-gray-200 rounded"
              onClick={handleLinkClick}
            >
              Ako Fungujeme?
            </Link>
          </li>
          {isAuthenticated && (
            <div className="border-b border-gray-200 mt-4">
              <div className="text-center mb-2">
                <button
                  onClick={handleSidebarDropdownToggle}
                  className="text-black hover:bg-gray-200 rounded-full p-2"
                >
                  
                  <AiOutlineUser size={20} className="inline" /> Môj Účet
                  {accountNotificationsCount > 0 && (
                    <span
                      className="
                        relative ml-2
                        -top-4
                        bg-red-500 text-white text-xs
                        w-5 h-5
                        rounded-full
                         
                        inline-block
                      "
                    >
                      {accountNotificationsCount}
                    </span>
                  )}
                </button>
                
              </div>
              {sidebarDropdownOpen && (
                <div className="pl-4">
                  {/* Môj profil */}
                  <span
                    onClick={() => {
                      navigate("/moj-profil");
                      onSidebarSelect("my-account");
                      handleLinkClick();
                      setSidebarDropdownOpen(false);
                    }}
                    className={`block py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      !profileComplete ? "bg-red-100" : ""
                    }`}
                  >
                    <FaRegAddressCard className="mr-2 inline" /> Môj Profil{" "}
                    {!profileComplete && (
                      <span className="text-red-500">*</span>
                    )}
                  </span>
                  {/* Vytvorené práce */}
                  <span
                    onClick={() => {
                      navigate("/moje-prace");
                      onSidebarSelect("moje-prace");
                      setNavbarDropdownOpen(false);
                    }}
                    className="relative block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <FaBriefcase className="mr-2 inline" /> Vytvorené práce
                    {/* Ak existuje aspoň 1 aktivita, zobraz badge s číslom */}
                    {creatorActivityCount > 0 && (
                      <span
                        className="
                          absolute top-2 right-2
                          bg-red-500 text-white text-[10px] font-bold
                          w-5 h-5
                          rounded-full
                          flex items-center justify-center
                        "
                      >
                        {creatorActivityCount}
                      </span>
                    )}
                  </span>

                  {/* Prihlásené práce */}
                  <span
                    onClick={() => {
                      navigate("/prihlasene-prace");
                      onSidebarSelect("prihlasene-prace");
                      setNavbarDropdownOpen(false);
                    }}
                    className="relative block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <FaUserCheck className="mr-2 inline" /> Prihlásené Práce
                    {/* Ak je workerActivityCount > 0, zobraz číselný badge */}
                    {workerActivityCount > 0 && (
                      <span
                        className="
                          absolute top-2 right-2
                          bg-red-500 text-white text-[10px] font-bold
                          w-5 h-5
                          rounded-full
                          flex items-center justify-center
                        "
                      >
                        {workerActivityCount}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="mt-6">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-black text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 w-full"
              >
                Odhlásiť sa
              </button>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    navigate("/login");
                    handleLinkClick();
                  }}
                  className="text-black block hover:bg-gray-200 p-2 rounded mx-auto"
                >
                  Prihlásiť sa
                </button>
                <button
                  onClick={() => {
                    navigate("/sign-up");
                    handleLinkClick();
                  }}
                  className="bg-black text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 w-full"
                >
                  Registrácia
                </button>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
