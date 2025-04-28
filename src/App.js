import React, { useState, useMemo } from 'react';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
import './App.css'; // Import external CSS

function App() {
  const [active, setActive] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const global = useGlobalContext();
  console.log(global);

  const displayData = () => {
    switch (active) {
      case 1:
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <div className="app">
      {orbMemo}
      <MainLayout>
        {/* Menu Toggle Button - Comes from Top */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* Navigation Menu - Slides from Top */}
        <div className={`navigation-container ${menuOpen ? 'open' : ''}`}>
          <Navigation active={active} setActive={setActive} />
        </div>

        <main onClick={() => setMenuOpen(false)}>{displayData()}</main>
      </MainLayout>
    </div>
  );
}

export default App;
