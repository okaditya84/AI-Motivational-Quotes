import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuoteCard from './QuoteCard';
import LoadingSpinner from './LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

function Explore() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('popular'); // 'popular' or 'latest'
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async (endpoint) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/quotes/${endpoint}${endpoint === 'search' ? '?query=' + searchTerm : ''}`);
      const data = await response.json();
      setQuotes(data.quotes);
    } catch (err) {
      console.error('Error fetching quotes', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'popular') {
      fetchQuotes('popular');
    } else if (activeTab === 'latest') {
      fetchQuotes('latest');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setActiveTab('search');
    await fetchQuotes('search');
  };

  return (
    <div style={{ background: theme.background, color: theme.text, minHeight: '100vh', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', color: theme.primary }}>Explore Quotes</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('popular')} className={activeTab === 'popular' ? 'tab-button active' : 'tab-button'}>Popular</button>
        <button onClick={() => setActiveTab('latest')} className={activeTab === 'latest' ? 'tab-button active' : 'tab-button'}>Latest</button>
      </div>
      <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '60%', maxWidth: '400px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>Search</button>
      </form>
      {loading ? (
        <LoadingSpinner />
      ) : quotes.length > 0 ? (
        <div className="quotes-grid">
          {quotes.map((quote) => (
            <motion.div key={quote.id} layout>
              <QuoteCard quote={quote.text} />
              {quote.like_count !== undefined && (
                <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>Likes: {quote.like_count}</p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No quotes found.</p>
      )}
    </div>
  );
}

export default Explore; 