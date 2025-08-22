// src/App.js
import React, { useState } from 'react';
import AdCard from './components/AdCard';
import Simulator from './components/Simulator';
import Alerts from './components/Alerts';
import Discovery from './components/Discovery'; // Import the new Discovery component
import './App.css';

function App() {
  // --- State Management for the new dynamic flow ---
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Handler Functions for User Actions ---

  // Called from Discovery component when competitors are found
  const handleCompetitorsFound = (foundCompetitors) => {
    setCompetitors(foundCompetitors);
    // Clear previous results when a new search is made
    setSelectedCompetitor(null);
    setAds([]);
  };

  // Called from Discovery component when a competitor button is clicked
  const handleCompetitorSelected = async (competitorName) => {
    setSelectedCompetitor(competitorName);
    setLoading(true);
    setError(null);
    setAds([]);

    try {
      // Step 1: Fetch the live ads for the selected competitor
      const adsResponse = await fetch(`http://127.0.0.1:8000/api/competitor-ads/${encodeURIComponent(competitorName)}`);
      if (!adsResponse.ok) throw new Error(`Failed to fetch ads for ${competitorName}`);
      let adsData = await adsResponse.json();

      if (adsData.length === 0) {
        setLoading(false);
        return; // No ads to analyze
      }

      // Step 2: Analyze the text of the fetched ads
      const analysisPromises = adsData.map(ad =>
        fetch('http://127.0.0.1:8000/api/analyze-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: ad.body_text || '' }) // Handle empty body_text
        }).then(res => res.json())
      );
      const analysisResults = await Promise.all(analysisPromises);

      // Step 3: Combine ad data with analysis results
      const enrichedAds = adsData.map((ad, index) => ({
        ...ad,
        id: `${competitorName}-${index}`, // Create a unique key for each ad
        tone: analysisResults[index]?.detected_tone,
      }));

      setAds(enrichedAds);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Competitor Ad Intelligence</h1>
      </header>
      <main className="main-content">
        {/* The Discovery component is always visible and drives the flow */}
        <Discovery
          onCompetitorsFound={handleCompetitorsFound}
          onCompetitorSelected={handleCompetitorSelected}
        />

        {/* The Simulator is always available for creative ideation */}
        <Simulator />

        {/* --- Conditionally render the ad feed and alerts --- */}
        {selectedCompetitor && (
          <>
            <Alerts />
            <h2 className="section-title">Live Competitor Ad Feed for "{selectedCompetitor}"</h2>
            
            {loading && (
              <div className="ad-grid">
                {[...Array(4)].map((_, i) => <div key={i} className="ad-card-skeleton"></div>)}
              </div>
            )}
            
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && ads.length > 0 && (
              <div className="ad-grid">
                {ads.map((ad) => (
                  <AdCard key={ad.id} {...ad} />
                ))}
              </div>
            )}

            {!loading && ads.length === 0 && !error && (
               <p className="info-message">No active ads found for this competitor.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;