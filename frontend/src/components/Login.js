import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthLayout from './AuthLayout';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <AuthLayout darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)}>
      <motion.div
        className="auth-form-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Enter your credentials to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <motion.span
            className="link"
            onClick={() => navigate('/register')}
            whileHover={{ color: darkMode ? '#38E1B9' : '#2D5AF0' }}
          >
            Register here
          </motion.span>
        </p>
      </motion.div>
    </AuthLayout>
  );
}

export default Login; 