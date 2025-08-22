// src/components/AdCard.js
import React from 'react';
import './AdCard.css'; // Import the CSS for this component

// Add "tone" to the list of props the component accepts
export default function AdCard({ platform, headline, body_text, image_url, cta_text, tone }) {
  const isMeta = platform.toLowerCase() === 'meta';
  const platformClass = isMeta ? 'platform-meta' : 'platform-google';
  const platformName = isMeta ? 'Meta' : 'Google';

  return (
    <div className="ad-card">
      <div className="ad-card-image-container">
        <img src={image_url.replace("example.com", "picsum.photos")} alt={headline} className="ad-card-image" />
        <span className={`platform-badge ${platformClass}`}>
          {platformName}
        </span>
      </div>
      <div className="ad-card-content">
        {/* --- NEW CODE: Conditionally render the AI insight tag --- */}
        {tone && (
          <div className="ai-insight-tag">
            AI Insight: <strong>{tone}</strong>
          </div>
        )}
        <h3 className="ad-card-headline">{headline}</h3>
        <p className="ad-card-body">{body_text}</p>
        {cta_text && (
          <a href="#" className="ad-card-cta">
            {cta_text}
          </a>
        )}
      </div>
    </div>
  );
} 