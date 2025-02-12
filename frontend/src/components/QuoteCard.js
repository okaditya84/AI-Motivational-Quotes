import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaBookmark, FaShare, FaCopy } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function QuoteCard({ quote, onLike, onSave, isLiked, isSaved }) {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Daily Motivation',
        text: quote,
        url: window.location.href
      });
    } catch (err) {
      // Fallback for desktop
      navigator.clipboard.writeText(quote);
      alert('Quote copied to clipboard!');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(quote);
    alert('Quote copied to clipboard!');
  };

  return (
    <motion.div 
      className="quote-card"
      style={{
        background: theme.cardBg,
        boxShadow: theme.cardShadow,
        border: `1px solid ${theme.divider}`
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setExpanded(!expanded)}
      layout
    >
      <motion.div className="quote-content">
        <blockquote>{quote}</blockquote>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="quote-actions"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <button 
              className={`action-btn ${isLiked ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
            >
              <FaHeart /> Like
            </button>
            <button 
              className={`action-btn ${isSaved ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
            >
              <FaBookmark /> Save
            </button>
            <button 
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <FaShare /> Share
            </button>
            <button 
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              <FaCopy /> Copy
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default QuoteCard; 