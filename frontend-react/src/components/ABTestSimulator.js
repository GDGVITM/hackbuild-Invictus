// src/components/ABTestSimulator.js
import React, { useState } from 'react';
import './ABTestSimulator.css';

const AdInputColumn = ({ ad, updateAd, removeAd }) => (
  <div className="ad-column">
    <div className="ad-column-header">
      <h3>Variation {String.fromCharCode(65 + ad.index)}</h3>
      <button onClick={() => removeAd(ad.id)} className="remove-btn">&times;</button>
    </div>
    <div className="form-group">
      <label>Headline</label>
      <input type="text" value={ad.headline} onChange={(e) => updateAd(ad.id, 'headline', e.target.value)} />
    </div>
    <div className="form-group">
      <label>Ad Text</label>
      <textarea value={ad.body_text} onChange={(e) => updateAd(ad.id, 'body_text', e.target.value)} rows="4" />
    </div>
    <div className="form-group">
      <label>Call to Action</label>
      <input type="text" value={ad.cta_text} onChange={(e) => updateAd(ad.id, 'cta_text', e.target.value)} />
    </div>
  </div>
);

export default function ABTestSimulator() {
  const [ads, setAds] = useState([
    { id: 1, headline: 'Discover our new shoe collection', body_text: 'Comfort and style in every step.', cta_text: 'Learn More' },
    { id: 2, headline: 'Shoe sale! Get yours now?', body_text: 'Limited time sale on our new collection.', cta_text: 'Shop Now' },
  ]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addAd = () => {
    setAds([...ads, { id: Date.now(), headline: '', body_text: '', cta_text: '' }]);
  };

  const updateAd = (id, field, value) => {
    setAds(ads.map(ad => ad.id === id ? { ...ad, [field]: value } : ad));
  };

  const removeAd = (id) => {
    if (ads.length > 2) { // Keep a minimum of 2 variations
      setAds(ads.filter(ad => ad.id !== id));
    }
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/simulate-ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads: ads }) // Send the array of ads
      });
      const data = await response.json();
      setResults(data.predictions);
    } catch (error) {
      console.error("A/B test simulation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getWinnerIndex = () => {
    if (!results || results.length === 0) return -1;
    return results.reduce((maxIndex, result, currentIndex, arr) => 
      result.score > arr[maxIndex].score ? currentIndex : maxIndex, 0);
  };
  const winnerIndex = getWinnerIndex();

  return (
    <div className="ab-simulator-container">
      <div className="ad-input-grid">
        {ads.map((ad, index) => (
          <AdInputColumn key={ad.id} ad={{...ad, index}} updateAd={updateAd} removeAd={removeAd} />
        ))}
      </div>
      <div className="actions-row">
        <button onClick={addAd} className="add-variation-btn">+ Add another variation</button>
        <button onClick={handleSimulate} disabled={isLoading} className="simulate-button">
          {isLoading ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>
      
      {isLoading && <div className="loader"></div>}
      
      {results && (
        <div className="results-container-ab">
          <h3>Simulation Results</h3>
          <div className="results-grid">
            {results.map((result, index) => (
              <div key={index} className={`result-card ${index === winnerIndex ? 'winner' : ''}`}>
                <h4>Variation {String.fromCharCode(65 + index)} Score: {result.score}/100</h4>
                <ul>{result.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="winner-declaration">
            Predicted Winner: <strong>Variation {String.fromCharCode(65 + winnerIndex)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}