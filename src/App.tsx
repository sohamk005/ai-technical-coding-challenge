import { useState } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { SplitBillCalculator } from './components/split-bill/SplitBillCalculator';
import { TabType } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('split-bill');

  return (
    <div className="app-root">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />
      <main className="app-main">
        {activeTab === 'split-bill' ? (
          <SplitBillCalculator />
        ) : (
          <div className="placeholder-tab-container">
            <div className="placeholder-card">
              <span className="placeholder-icon">🚗</span>
              <h2>Parking Fee Calculator</h2>
              <p>The Parking Fee Calculator will be implemented in Milestone 3.</p>
              <button
                type="button"
                className="btn-back-to-active"
                onClick={() => setActiveTab('split-bill')}
              >
                Go to Split Bill Calculator
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>AI Technical Coding Challenge &bull; Split Bill &amp; Parking Calculators</p>
      </footer>
    </div>
  );
}

export default App;
