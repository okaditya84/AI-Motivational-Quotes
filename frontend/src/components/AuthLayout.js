import React from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';

function AuthLayout({ children, darkMode, toggleDarkMode }) {
  return (
    <div className={`auth-page ${darkMode ? 'dark' : ''}`}>
      <motion.button
        className="theme-toggle"
        onClick={toggleDarkMode}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </motion.button>
      
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
      
      <div className="auth-background">
        <div className="circles">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="circle" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout; 