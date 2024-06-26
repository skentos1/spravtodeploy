import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu, AiOutlineUser } from 'react-icons/ai'; // Import AiOutlineUser for the profile icon
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/HM.jpg';
import { useAuth } from './AuthContext'; // Adjust the path as needed

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for the dropdown menu
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLinkClick = () => {
    setNav(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown menu
  };

  return (
    <div className='flex justify-between items-center h-20 w-full pt-1 px-4 text-black bg-white border-b border-gray-200 font-sans'>
      {/* Logo and Title */}
      <div className='flex items-center'>
        <img src={logo} alt="HodinovyManzel Logo" className="h-14 mr-2" />
        <h1 className='text-xl font-bold'>
          <Link to='/'>Hodinový Manžel</Link>
        </h1>
      </div>

      {/* Centered Links */}
      <ul className='hidden lg:flex space-x-2 flex-grow justify-center'>
        <Link to='/' className='p-2 my-2 text-sm hover:bg-gray-100 rounded-xl'>Domov</Link>
        <Link to='/sluzby' className='p-2 my-2 text-sm hover:bg-gray-100 rounded-xl'>Sluzby</Link>
        <Link to='/prace' className='p-2 my-2 text-sm hover:bg-gray-100 rounded-xl'>Ponuka prac</Link>
        <Link to='/o-nas' className='p-2 my-2 text-sm hover:bg-gray-100 rounded-xl'>O nás</Link>
      </ul>

      {/* Right Side Buttons */}
      <div className='hidden lg:flex space-x-4 items-center'>
        {isAuthenticated ? (
          <>
            <div className='relative'>
              <button onClick={handleDropdownToggle} className='text-black text-sm flex items-center hover:bg-gray-200 p-2 rounded-xl'>
                <AiOutlineUser size={20} className='mr-2' />
                <span>Moj Účet</span>
              </button>
              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'>
                  <Link to='/my-account' className='block px-4 py-2 text-sm hover:bg-gray-100' onClick={() => setDropdownOpen(false)}>Moj Profil</Link>
                  <Link to='/moje-prace' className='block px-4 py-2 text-sm hover:bg-gray-100' onClick={() => setDropdownOpen(false)}>Moje prace</Link>
                  <Link to='/moje-sluzby' className='block px-4 py-2 text-sm hover:bg-gray-100' onClick={() => setDropdownOpen(false)}>Moje Sluzby</Link>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className='bg-black text-sm text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-800'>Odhlásiť sa</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className='text-black text-sm hover:bg-gray-200 p-2 rounded-xl'>Prihlásiť sa</button>
            <button onClick={() => navigate('/sign-up')} className='bg-black text-sm text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-800'>Sign Up</button>
          </>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div onClick={handleNav} className='block lg:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Menu */}
      <div className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-gray-200 bg-white ease-in-out duration-500 z-10' : 'fixed left-[-100%] ease-in-out duration-500 z-10'}>
        <ul className='p-4'>
          <div className='flex items-center mb-4'>
            <img src={logo} alt="HodinovyManzel Logo" className="h-16 mr-2" />
            <h1 className='w-full text-2xl font-bold'>
              <Link to='/'>Hodinový Manžel</Link>
            </h1>
          </div>
          <li className='border-b border-gray-200'>
            <Link to='/' className='block p-4 hover:bg-gray-200 rounded' onClick={handleLinkClick}>Domov</Link>
          </li>
          <li className='border-b border-gray-200'>
            <Link to='/sluzby' className='block p-4 hover:bg-gray-200 rounded' onClick={handleLinkClick}>Sluzby</Link>
          </li>
          <li className='border-b border-gray-200'>
            <Link to='/prace' className='block p-4 hover:bg-gray-200 rounded' onClick={handleLinkClick}>Ponuka prac</Link>
          </li>
          <li className='border-b border-gray-200'>
            <Link to='/o-nas' className='block p-4 hover:bg-gray-200 rounded' onClick={handleLinkClick}>O nás</Link>
          </li>
          <div className='mt-4'>
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate('/my-account')} className='text-black block mb-4 hover:bg-gray-200 p-2 rounded'>Moj Účet</button>
                <button onClick={handleLogout} className='bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800'>Odhlásiť sa</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className='text-black block mb-4 hover:bg-gray-200 p-2 rounded'>Prihlásiť sa</button>
                <button onClick={() => navigate('/sign-up')} className='bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800'>Sign Up</button>
              </>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
