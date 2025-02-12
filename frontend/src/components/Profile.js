import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useTheme } from '../context/ThemeContext';
import { FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

function Profile() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, theme } = useTheme();
  const [activeTab, setActiveTab] = useState('liked'); // 'liked' or 'saved'
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [profileData, setProfileData] = useState({ username: 'Your Profile' });
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profileData.username);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchProfile();
      fetchLikedQuotes();
      fetchSavedQuotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      setProfileData(data);
      setNewUsername(data.username);
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  };

  const fetchLikedQuotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quotes/liked', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      setLikedQuotes(data.liked_quotes || []);
    } catch (err) {
      console.error("Error fetching liked quotes", err);
    }
  };

  const fetchSavedQuotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quotes/saved', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      setSavedQuotes(data.saved_quotes || []);
    } catch (err) {
      console.error("Error fetching saved quotes", err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ username: newUsername })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Profile updated successfully');
        setProfileData((prev) => ({ ...prev, username: newUsername }));
        setEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Server error while updating profile');
    }
  };

  const renderQuotes = (quotes) => {
    return (
      <div className="quotes-grid">
        {quotes.map((quote) => (
          <motion.div 
            className="quote-card profile-quote-card"
            key={quote.id}
            style={{
              background: theme.cardBg,
              boxShadow: theme.cardShadow,
              border: `1px solid ${theme.divider}`
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <blockquote>{quote.text}</blockquote>
            <span className="quote-timestamp">{quote.generated_at}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className={`profile-page ${darkMode ? 'dark' : ''}`} style={{ background: theme.background, color: theme.text }}>
      <NavBar />
      <div className="profile-container">
        <header className="profile-header" style={{ background: theme.navBg }}>
          <div className="profile-info">
            <FaUserCircle size={80} color={theme.primary} />
            <div className="profile-details">
              {editing ? (
                <>
                  <input 
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    style={{ padding: '0.5rem', fontSize: '1.8rem' }}
                  />
                  <button onClick={handleProfileUpdate} className="theme-toggle-btn" style={{ marginLeft: '1rem' }}>
                    Save
                  </button>
                  <button onClick={() => setEditing(false)} className="theme-toggle-btn" style={{ marginLeft: '1rem' }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h1>{profileData.username}</h1>
                  <button onClick={() => setEditing(true)} className="theme-toggle-btn">
                    Edit Profile
                  </button>
                </>
              )}
              <div className="profile-stats">
                <span>{likedQuotes.length} Liked</span>
                <span>{savedQuotes.length} Saved</span>
              </div>
            </div>
          </div>
          <button className="theme-toggle-btn" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'liked' ? 'active' : ''}`}
            onClick={() => setActiveTab('liked')}
          >
            Liked Quotes
          </button>
          <button 
            className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Quotes
          </button>
        </div>
        <main className="profile-content">
          <AnimatePresence exitBeforeEnter>
            {activeTab === 'liked' ? (
              <motion.div 
                key="liked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {likedQuotes.length > 0 ? renderQuotes(likedQuotes) : <p>No liked quotes yet.</p>}
              </motion.div>
            ) : (
              <motion.div 
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {savedQuotes.length > 0 ? renderQuotes(savedQuotes) : <p>No saved quotes yet.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Profile; 