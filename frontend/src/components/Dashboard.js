import React, { useState, useEffect } from 'react';
import QuoteCard from './QuoteCard';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [quoteData, setQuoteData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchDailyQuote();
      fetchSavedQuotes();
    }
    // eslint-disable-next-line
  }, []);

  const fetchDailyQuote = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quotes/daily');
      const data = await response.json();
      setQuoteData(data);
    } catch (err) {
      console.error("Error fetching quote", err);
    }
  };

  const fetchSavedQuotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quotes/saved', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.saved_quotes) {
        setSavedQuotes(data.saved_quotes);
      }
    } catch (err) {
      console.error("Error fetching saved quotes", err);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quotes/like', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ quote_id: quoteData.id })
      });
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error("Error liking quote", err);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quotes/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ quote_id: quoteData.id })
      });
      const data = await response.json();
      alert(data.message);
      fetchSavedQuotes();
    } catch (err) {
      console.error("Error saving quote", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard"}>
      <header>
        <h1>Daily Motivation</h1>
        <div className="header-actions">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main>
        {quoteData ? (
          <div>
            <QuoteCard quote={quoteData.quote} />
            <div className="actions">
              <button onClick={handleLike}>Like</button>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        ) : (
          <p>Loading today's quote...</p>
        )}
        <section className="saved-quotes">
          <h2>Saved Quotes</h2>
          {savedQuotes.length > 0 ? (
            savedQuotes.map((q) => (
              <div key={q.id} className="quote-item">
                <p>{q.text}</p>
                <span>{q.generated_at}</span>
              </div>
            ))
          ) : (
            <p>No saved quotes.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard; 