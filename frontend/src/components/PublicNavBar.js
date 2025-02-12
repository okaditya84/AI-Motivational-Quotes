import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

function PublicNavBar() {
  const { darkMode, toggleDarkMode, theme } = useTheme();

  return (
    <nav className="public-navbar" style={{ background: theme.navBg, boxShadow: theme.cardShadow }}>
      <div className="navbar-logo">
        <Link to="/">InspireVerse</Link>
      </div>
      <div className="navbar-toggle">
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={toggleDarkMode} 
          className="theme-btn" 
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </motion.button>
      </div>
    </nav>
  );
}

export default PublicNavBar; 