// src/components/ABTestSimulator.js
import React, { useState } from 'react';
import './ABTestSimulator.css';

const AdInputColumn = ({ ad, setAd, title }) => (
  <div className="ad-column">
    <h3>{title}</h3>
    <div className="form-group">
      <label>Headline</label>
      <input type="text" value={ad.headline} onChange={(e) => setAd({ ...ad, headline: e.target.value })} />
    </div>
    <div className="form-group">
      <label>Ad Text</label>
      <textarea value={ad.body_text} onChange={(e) => setAd({ ...ad, body_text: e.target.value })} rows="4" />
    </div>
    <div className="form-group">
      <label>Call to Action</label>
      <input type="text" value={ad.cta_text} onChange={(e) => setAd({ ...ad, cta_text: e.target.value })} />
    </div>
  </div>
);

const ResultsDisplay = ({ results }) => {
  const winner = results.ad_a.score > results.ad_b.score ? 'A' : 'B';
  return (
    <div className="results-container-ab">
      <h3>Simulation Results</h3>
      <div className="results-grid">
        <div className={`result-card ${winner === 'A' ? 'winner' : ''}`}>
          <h4>Ad A Score: {results.ad_a.score}/100</h4>
          <ul>{results.ad_a.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>
        <div className={`result-card ${winner === 'B' ? 'winner' : ''}`}>
          <h4>Ad B Score: {results.ad_b.score}/100</h4>
          <ul>{results.ad_b.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>
      </div>
      <div className="winner-declaration">
        Predicted Winner: <strong>Ad {winner}</strong>
      </div>
    </div>
  );
};

export default function ABTestSimulator() {
  const [adA, setAdA] = useState({ headline: 'Discover our new shoe collection', body_text: 'Comfort and style in every step.', cta_text: 'Learn More' });
  const [adB, setAdB] =  useState({ headline: 'Shoe sale! Get yours now?', body_text: 'Limited time sale on our new collection.', cta_text: 'Shop Now' });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/simulate-ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_a: adA, ad_b: adB })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("A/B test simulation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ab-simulator-container">
      <div className="ad-input-grid">
        <AdInputColumn ad={adA} setAd={setAdA} title="Ad Variation A" />
        <AdInputColumn ad={adB} setAd={setAdB} title="Ad Variation B" />
      </div>
      <button onClick={handleSimulate} disabled={isLoading} className="simulate-button">
        {isLoading ? 'Simulating...' : 'Run A/B Test Simulation'}
      </button>
      {isLoading && <div className="loader"></div>}
      {results && <ResultsDisplay results={results} />}
    </div>
  );
}