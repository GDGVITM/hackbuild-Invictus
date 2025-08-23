// src/pages/SimulatorPage.js
import React from 'react';
import Simulator from '../components/Simulator';
import ABTestSimulator from '../components/ABTestSimulator'; // Import the new component

export default function SimulatorPage() {
  return (
    <>
      <h1 className="page-title">AI Strategy Tools</h1>
      <p className="page-description">
        Use our generative AI to create and test data-driven ad campaigns from scratch.
      </p>

      {/* Existing Campaign Generator */}
      <Simulator />

      {/* NEW A/B Testing Simulator */}
      <h2 className="section-title">A/B Testing Simulator</h2>
      <ABTestSimulator />
    </>
  );
}