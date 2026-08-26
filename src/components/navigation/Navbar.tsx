import React from 'react';
import './Navbar.css';

interface NavbarProps {
  activeTab: 'split-bill' | 'parking';
  onSelectTab: (tab: 'split-bill' | 'parking') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="app-navbar">
      <div className="navbar-brand">
        <span className="navbar-logo-icon">🧮</span>
        <span className="navbar-title">AI Challenge Calculators</span>
      </div>
      <div className="navbar-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'split-bill'}
          className={`nav-tab-btn ${activeTab === 'split-bill' ? 'active' : ''}`}
          onClick={() => onSelectTab('split-bill')}
        >
          Split Bill Calculator
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'parking'}
          className={`nav-tab-btn ${activeTab === 'parking' ? 'active' : ''}`}
          onClick={() => onSelectTab('parking')}
        >
          Parking Fee Calculator
        </button>
      </div>
    </nav>
  );
};
