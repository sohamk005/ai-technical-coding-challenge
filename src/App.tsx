import { useState } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { SplitBillCalculator } from './components/split-bill/SplitBillCalculator';
import { ParkingFeeCalculator } from './components/parking/ParkingFeeCalculator';
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
          <ParkingFeeCalculator />
        )}
      </main>
      <footer className="app-footer">
        <p>AI Technical Coding Challenge &bull; Split Bill &amp; Parking Calculators</p>
      </footer>
    </div>
  );
}

export default App;
