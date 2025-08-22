// src/components/Simulator.js
import React, { useState } from 'react';
import './Simulator.css';

export default function Simulator() {
  const [product, setProduct] = useState('A durable, stylish backpack for daily urban commuters.');
  const [tone, setTone] = useState('Playful');
  const [style, setStyle] = useState('Minimalist');
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCampaign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCampaign(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_description: product,
          tone: tone,
          style: style,
        })
      });
      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      console.error("Failed to generate campaign:", error);
      // You could set an error state here to show in the UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="simulator-container">
      <h2>✨ AI Strategy Simulator</h2>
      <form onSubmit={generateCampaign}>
        {/* The form section remains the same */}
        <div className="form-group">
          <label htmlFor="product">Product Description</label>
          <textarea id="product" value={product} onChange={(e) => setProduct(e.target.value)} rows="3"></textarea>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tone">Tone</label>
            <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Playful</option>
              <option>Formal</option>
              <option>Urgent</option>
              <option>Inspirational</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="style">Visual Style</label>
            <select id="style" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option>Minimalist</option>
              <option>Vibrant & Bold</option>
              <option>Lifestyle Photo</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Campaign'}</button>
      </form>

      {isLoading && <div className="loader"></div>}
      
      {campaign && (
        <div className="results-container">
          <h3>Generated Campaign</h3>
          <div className="result-section">
            <h4>Headlines</h4>
            {/* FIX: Add optional chaining '?.' here */}
            <ul>{campaign.headlines?.map((h, i) => <li key={i}>{h}</li>)}</ul>
          </div>
          <div className="result-section">
            <h4>Ad Copy</h4>
            <p>{campaign.body_copy}</p>
          </div>
          <div className="result-section">
            <h4>Visual Prompt for AI</h4>
            <p className="prompt-text">{campaign.visual_prompt}</p>
          </div>
          <div className="result-section reasoning">
            <h4>✅ Why This Works (AI Reasoning)</h4>
            {/* FIX: Add optional chaining '?.' here */}
            <ul>{campaign.reasoning?.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}