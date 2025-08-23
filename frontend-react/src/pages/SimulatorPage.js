// src/pages/SimulatorPage.js
import React from 'react';
import Simulator from '../components/Simulator';

export default function SimulatorPage() {
  return (
    <>
      <h1 className="page-title">AI Strategy Simulator</h1>
      <p className="page-description">
        Use our generative AI to create a complete, data-driven ad campaign from scratch.
        Adjust the creative direction and get instant results based on competitive insights.
      </p>
      <Simulator />
    </>
  );
}