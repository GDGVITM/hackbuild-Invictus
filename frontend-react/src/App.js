// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CompetitorPage from './pages/CompetitorPage';
import SimulatorPage from './pages/SimulatorPage';
import Chatbot from './components/Chatbot';
import './App.css';

// src/App.js
// ... imports
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CompetitorPage />} />
            <Route path="/simulator" element={<SimulatorPage />} /> {/* This line renders the page */}
          </Routes>
        </main>
        <Chatbot />
      </div>
    </Router>
  );
}
// ...

export default App;