// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Competitor Ad Intelligence</h1>
      </div>
      <nav className="main-nav">
        <NavLink to="/">Competitor Intelligence</NavLink>
        <NavLink to="/simulator">AI Strategy Simulator</NavLink>
      </nav>
    </header>
  );
}