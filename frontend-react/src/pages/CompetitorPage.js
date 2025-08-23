// src/pages/CompetitorPage.js
import React, { useState } from 'react';
import AdCard from '../components/AdCard';
import Alerts from '../components/Alerts';
import Discovery from '../components/Discovery';
import '../App.css'; // We can reuse some of the main styles

export default function CompetitorPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompetitorsFound = () => {
    setSelectedCompetitor(null);
    setAds([]);
  };

  const handleCompetitorSelected = async (competitorName) => {
    setSelectedCompetitor(competitorName);
    setLoading(true);
    setError(null);
    setAds([]);
    try {
      const adsResponse = await fetch(`http://127.0.0.1:8000/api/competitor-ads/${encodeURIComponent(competitorName)}`);
      if (!adsResponse.ok) throw new Error(`Failed to fetch ads for ${competitorName}`);
      let adsData = await adsResponse.json();
      if (adsData.length === 0) {
        setLoading(false);
        return;
      }
      const analysisPromises = adsData.map(ad =>
        fetch('http://127.0.0.1:8000/api/analyze-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: ad.body_text || '' })
        }).then(res => res.json())
      );
      const analysisResults = await Promise.all(analysisPromises);
      const enrichedAds = adsData.map((ad, index) => ({
        ...ad,
        id: `${competitorName}-${index}`,
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
    <>
      <Discovery
        onCompetitorsFound={handleCompetitorsFound}
        onCompetitorSelected={handleCompetitorSelected}
      />
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
              {ads.map((ad) => (<AdCard key={ad.id} {...ad} />))}
            </div>
          )}
          {!loading && ads.length === 0 && !error && (
            <p className="info-message">No active ads found for this competitor.</p>
          )}
        </>
      )}
    </>
  );
}