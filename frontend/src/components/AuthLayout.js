import React from 'react';
import { motion } from 'framer-motion';
import PublicNavBar from './PublicNavBar';

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <PublicNavBar />
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