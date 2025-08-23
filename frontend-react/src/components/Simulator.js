// src/components/Simulator.js
import React, { useState } from 'react';
import './Simulator.css';

export default function Simulator() {
  const [product, setProduct] = useState('A durable, stylish backpack for daily urban commuters.');
  const [tone, setTone] = useState('Playful');
  const [style, setStyle] = useState('Minimalist');
  
  // State for text-based results
  const [campaign, setCampaign] = useState(null);
  const [isTextLoading, setIsTextLoading] = useState(false);

  // State for the generated image
  const [imageUrl, setImageUrl] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);

  const generateCampaign = async (e) => {
    e.preventDefault();
    // Reset all previous results and set loading states
    setIsTextLoading(true);
    setIsImageLoading(true);
    setCampaign(null);
    setImageUrl('');

    try {
      // --- Step 1: Generate Campaign Text & Ideas ---
      const textResponse = await fetch('http://127.0.0.1:8000/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_description: product, tone: tone, style: style })
      });
      const textData = await textResponse.json();
      setCampaign(textData);
      setIsTextLoading(false); // Text is done loading

      // --- Step 2: Generate Image using the prompt from the text response ---
      if (textData.visual_prompt) {
        const imageResponse = await fetch('http://127.0.0.1:8000/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: textData.visual_prompt })
        });
        
        if (!imageResponse.ok) throw new Error('Image generation failed.');
        
        const imageBlob = await imageResponse.blob();
        const localImageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(localImageUrl);
      }
    } catch (error) {
      console.error("Failed to generate campaign or image:", error);
    } finally {
      // Ensure all loading states are turned off
      setIsTextLoading(false);
      setIsImageLoading(false);
    }
  };

  return (
    <div className="simulator-container">
      <h2>✨ AI Strategy Simulator</h2>
      <form onSubmit={generateCampaign}>
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
        <button type="submit" disabled={isTextLoading || isImageLoading}>
          {isTextLoading ? 'Generating Text...' : isImageLoading ? 'Generating Image...' : 'Generate Campaign'}
        </button>
      </form>

      {(isTextLoading || isImageLoading) && <div className="loader"></div>}
      
      {campaign && (
        <div className="results-container">
          <h3>Generated Campaign</h3>
          <div className="campaign-layout">
            <div className="text-results">
              <div className="result-section">
                <h4>Headlines</h4>
                <ul>{campaign.headlines?.map((h, i) => <li key={i}>{h}</li>)}</ul>
              </div>
              <div className="result-section">
                <h4>Ad Copy</h4>
                <p>{campaign.body_copy}</p>
              </div>
              <div className="result-section">
                <h4>Visual Prompt for AI Image</h4>
                <p className="prompt-text">{campaign.visual_prompt}</p>
              </div>
            </div>
            <div className="image-result">
              <h4>Generated Ad Visual</h4>
              {isImageLoading && <div className="image-placeholder">🎨 Generating Image... Please wait...</div>}
              {imageUrl && <img src={imageUrl} alt="AI generated visual" className="generated-image" />}
            </div>
          </div>
          
          {campaign.video_storyboard && (
            <div className="result-section">
              <h4>🎬 3-Second Video Ad Storyboard</h4>
              <div className="storyboard">
                {campaign.video_storyboard.map((scene, i) => (
                  <div key={i} className="scene">
                    <div className="scene-number">Scene {i + 1}</div>
                    <div className="scene-content">
                      <strong>Visual:</strong> {scene.visual}
                    </div>
                    <div className="scene-content">
                      <strong>Text Overlay:</strong> {scene.overlay_text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="result-section reasoning">
            <h4>✅ Why This Works (AI Reasoning)</h4>
            <ul>{campaign.reasoning?.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}