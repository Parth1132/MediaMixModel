import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MeasurementDilemma } from './components/MeasurementDilemma';
import { BudgetSimulator } from './components/BudgetSimulator';
import { SaturationCurves } from './components/SaturationCurves';
import { AttributionDecomposition } from './components/AttributionDecomposition';
import { EconometricMath } from './components/EconometricMath';
import { BusinessUseCases } from './components/BusinessUseCases';
import { Footer } from './components/Footer';
import { checkBackendHealth } from './services/api';

export function App() {
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    checkBackendHealth().then((isOnline) => {
      setBackendConnected(isOnline);
    });
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#07090E', color: '#F8FAFC' }}>
      {/* Background Decorators */}
      <div className="ambient-glow-top" />
      <div className="grid-lines" />

      {/* Page Sections */}
      <Header backendConnected={backendConnected} />
      <main>
        <Hero />
        <MeasurementDilemma />
        <BudgetSimulator />
        <SaturationCurves />
        <AttributionDecomposition />
        <EconometricMath />
        <BusinessUseCases />
      </main>
      <Footer />
    </div>
  );
}

export default App;
