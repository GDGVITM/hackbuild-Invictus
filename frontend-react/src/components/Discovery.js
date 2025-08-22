// src/components/Discovery.js
import React, { useState } from 'react';
import './Discovery.css';

export default function Discovery({ onCompetitorsFound, onCompetitorSelected }) {
  const [description, setDescription] = useState('A durable, stylish backpack for daily urban commuters.');
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDiscover = async () => {
    setIsLoading(true);
    setError('');
    setCompetitors([]);
    onCompetitorsFound([]); // Clear previous results in parent

    try {
      const response = await fetch('http://127.0.0.1:8000/api/discover-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description })
      });
      if (!response.ok) throw new Error('Failed to discover competitors.');
      const data = await response.json();
      setCompetitors(data.competitors);
      onCompetitorsFound(data.competitors); // Notify parent
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="discovery-container">
      <h2>1. Describe Your Product</h2>
      <p>Enter a description of your product, and our AI will find relevant competitors.</p>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
        placeholder="e.g., High-performance running shoes with extra cushioning"
      />
      <button onClick={handleDiscover} disabled={isLoading}>
        {isLoading ? 'Discovering...' : 'Discover Competitors'}
      </button>
      {error && <p className="error-message">{error}</p>}

      {competitors.length > 0 && (
        <div className="competitor-results">
          <h2>2. Select a Competitor to Analyze</h2>
          <div className="competitor-list">
            {competitors.map((name) => (
              <button key={name} className="competitor-button" onClick={() => onCompetitorSelected(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}