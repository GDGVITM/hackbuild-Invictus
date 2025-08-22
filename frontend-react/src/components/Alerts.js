// src/components/Alerts.js
import React, { useState } from 'react';
import './Alerts.css';

export default function Alerts() {
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkForNewAds = async () => {
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/check-for-new-ads');
      const newAds = await response.json();

      if (newAds.length > 0) {
        // For simplicity, we'll just show a message for the first new ad found.
        const firstNewAd = newAds[0];
        setNotification(`🔔 New Ad Found! Competitor '${firstNewAd.competitor_name}' launched a campaign: "${firstNewAd.headline}"`);
      } else {
        setNotification("✅ No new ads found. You're all up to date!");
      }
    } catch (error) {
      console.error("Failed to check for new ads:", error);
      setNotification("❌ Error checking for ads.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="alerts-container">
      <button onClick={checkForNewAds} disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Check for New Competitor Ads'}
      </button>
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}
    </div>
  );
}