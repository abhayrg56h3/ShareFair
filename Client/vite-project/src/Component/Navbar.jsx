import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { myContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { User, Plus, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const usernameRef = useRef(null);
  const { setCurrUser, lightMode, setLightMode, currUser, menuBar, setMenuBar, visible, setVisible } = useContext(myContext);
  const navigate = useNavigate();

  useEffect(() => {
    function handleMousedown(e) {
      if (dropDownRef.current && usernameRef.current && 
          !dropDownRef.current.contains(e.target) && 
          !usernameRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMousedown);
    return () => {
      document.removeEventListener("mousedown", handleMousedown);
    };
  }, []);

  function handleClick(type) {
    if (type === "Group") {
      setIsDropdownOpen(false);
      navigate('/creategroup');
    } else {
      setIsDropdownOpen(false);
      navigate('/profile');
    }
  }

  async function handleLogout() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        withCredentials: true
      });
      setCurrUser(null);
      navigate('/register');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className='h-16 z-50 fixed w-full bg-gradient-to-r from-indigo-700 via-purple-700 to-purple-800 backdrop-blur-sm text-white shadow-2xl border-b border-white/10'>
      <div className='h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
        
        {/* Mobile Menu Button */}
        <div className='lg:hidden'>
          <button 
            onClick={() => setMenuBar(!menuBar)}
            className='group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-white/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20'
            aria-label="Toggle menu"
          >
            <MenuIcon className='w-6 h-6 group-hover:scale-110 transition-transform duration-200' />
          </button> 
        </div>

        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className='flex-shrink-0 cursor-pointer group'
        >
          <div className='text-2xl sm:text-3xl font-bold tracking-wide transform transition-all duration-300 group-hover:scale-105'>
            <span className='text-white drop-shadow-lg bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent'>
              Share
            </span>
            <span className='text-purple-200 drop-shadow-lg bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent'>
              Fair
            </span>
          </div>
        </div>



        {/* User Section */}
        <div className='relative flex items-center' ref={usernameRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='group flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-white/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20'
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className='relative'>
              <img 
                src={currUser?.profilePicture}
                alt={`${currUser?.name}'s profile`}
                className='w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-white/30 object-cover transition-all duration-300 group-hover:ring-white/50 group-hover:scale-105'
              />
              <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm'></div>
            </div>
            <div className='hidden sm:flex flex-col items-start'>
              <span className='text-sm font-medium text-white/90 group-hover:text-white transition-colors'>
                {currUser?.name}
              </span>
              <span className='text-xs text-white/60'>
                Online
              </span>
            </div>
            <svg 
              className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              ref={dropDownRef} 
              className="absolute z-50 top-full right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl min-w-[220px] overflow-hidden animate-in slide-in-from-top-2 duration-200"
            >
              <div className='p-2'>
                {/* Mobile-only user info */}
                <div className='sm:hidden px-4 py-3 border-b border-gray-200/50 mb-2'>
                  <p className='font-semibold text-gray-800'>{currUser?.name}</p>
                  <p className='text-sm text-gray-500'>Online</p>
                </div>

                <ul className='space-y-1'>
                  <li>
                    <button
                      onClick={() => handleClick("Profile")}
                      className='w-full px-4 py-3 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-medium flex items-center gap-3 text-left text-gray-700 group'
                    >
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Profile
                    </button>
                  </li>
                  
                  <li>
                    <button
                      onClick={() => handleClick("Group")}
                      className='w-full px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 font-medium flex items-center gap-3 text-left text-gray-700 group'
                    >
                      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Create Group
                    </button>
                  </li>

                  <li className='pt-2 border-t border-gray-200/50'>
                    <button
                      onClick={handleLogout}
                      className='w-full px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium flex items-center gap-3 text-left text-gray-700 group'
                    >
                      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add some CSS for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation-fill-mode: forwards;
        }

        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}