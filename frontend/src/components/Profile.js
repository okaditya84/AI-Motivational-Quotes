import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Profile() {
  const navigate = useNavigate();
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const { darkMode, toggleDarkMode } = useTheme();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchLikedQuotes();
      fetchSavedQuotes();
    }
  }, [token, navigate]);

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

  return (
    <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
      <header>
        <h1>Your Profile</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <main>
        <section>
          <h2>Liked Quotes</h2>
          {likedQuotes.length > 0 ? (
            likedQuotes.map((quote) => (
              <div key={quote.id} className="quote-item">
                <p>{quote.text}</p>
              </div>
            ))
          ) : (
            <p>No liked quotes yet.</p>
          )}
        </section>
        <section>
          <h2>Saved Quotes</h2>
          {savedQuotes.length > 0 ? (
            savedQuotes.map((quote) => (
              <div key={quote.id} className="quote-item">
                <p>{quote.text}</p>
              </div>
            ))
          ) : (
            <p>No saved quotes yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Profile; 