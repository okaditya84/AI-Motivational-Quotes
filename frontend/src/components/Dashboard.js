import React, { useState, useEffect } from 'react';
import QuoteCard from './QuoteCard';
import NavBar from './NavBar';
import { useTheme } from '../context/ThemeContext';

function Dashboard() {
  const [quoteData, setQuoteData] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const token = localStorage.getItem('token');
  const { theme } = useTheme();

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchDailyQuote();
      fetchSavedQuotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="dashboard" style={{ background: theme.background, color: theme.text }}>
      <NavBar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Daily Motivation</h1>
        {quoteData ? (
          <div>
            <QuoteCard quote={quoteData.quote} onLike={handleLike} onSave={handleSave}/>
            <div className="actions">
              <button onClick={handleLike} className="action-button">Like</button>
              <button onClick={handleSave} className="action-button">Save</button>
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
      </div>
    </div>
  );
}

export default Dashboard; 