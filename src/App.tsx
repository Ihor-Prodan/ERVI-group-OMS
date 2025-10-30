'use strict';
import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import AppRoutes from './components/router/Router';
import LoginHandler from './components/login/LoginHandler';
import type { ParcelStep } from './components/orders/types';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [parcelNumber, setParcelNumber] = useState('');
  const [steps, setSteps] = useState<ParcelStep[]>([]);

  return (
    <Router>
      <Header
        onLoginClick={() => setIsLoginOpen(true)}
        parcelNumber={parcelNumber}
        setParcelNumber={setParcelNumber}
        setSteps={setSteps}
        steps={steps}
      />

      <div className="app-container">
        <AppRoutes steps={steps} setSteps={setSteps} setParcelNumber={setParcelNumber} />
      </div>

      <Footer />

      {isLoginOpen && <LoginHandler onClose={() => setIsLoginOpen(false)} />}
    </Router>
  );
}

export default App;
