import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

function NavBar() {
  const { darkMode, toggleDarkMode, theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ background: theme.navBg, boxShadow: theme.cardShadow }}>
      <div className="navbar-logo">
        <Link to="/">InspireVerse</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/explore">Explore</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={toggleDarkMode} 
            className="theme-btn"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>
        </li>
        <li>
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={handleLogout} 
            className="logout-btn"
            title="Logout"
          >
            Logout
          </motion.button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar; 