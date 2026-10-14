import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../Icon';
import AnimatedNumber from '../../AnimatedNumber';
import logo from '../../../../assets/LOGO-white.png';
import heroPhoto from '../../../../assets/hero-van.jpg';
import useAuth from '../../../../hooks/useAuth';
import './Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isCompany } = useAuth();

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate(isAdmin ? '/admin/home' : isCompany ? '/admin/new-order' : '/admin/documents');
  };

  return (
    <section
      className="landing__hero"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 0%, transparent 90%, #ffffff 100%), radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.3), transparent 45%), linear-gradient(135deg, rgba(15, 23, 42, 0.93) 0%, rgba(30, 41, 59, 0.9) 55%, rgba(37, 99, 235, 0.78) 100%), url(${heroPhoto})`,
      }}
    >
      <div className="landing__hero-inner">
        <div className="landing__logo">
          <img src={logo} alt="ERVI Group" />
        </div>
        <h1 className="landing__hero-title">AUTODOPRAVA VEĽKÉHO TOVARU</h1>
        <h2 className="landing__hero-subtitle">
          OD RÝCHLEJ PREPRAVY AŽ PO MONTÁŽ U VÁŠHO ZÁKAZNÍKA
        </h2>
        <p className="landing__hero-text">
          Spoľahlivá preprava nábytku, spotrebičov a DIY sortimentu vrátane výnosu do bytu a
          odbornej montáže.
        </p>
        <div className="landing__hero-actions">
          <button className="landing__cta" onClick={handleOrderClick}>
            OBJEDNAŤ DOVOZ
            <span className="landing__cta-divider">
              <Icon name="truck" />
            </span>
          </button>
          <div className="landing__hero-stat">
            <strong>
              <AnimatedNumber value={1000} />+
            </strong>
            spokojných klientov
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
