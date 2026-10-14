import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h3 className="footer-logo">ERVI group</h3>
        <p className="footer-copy">&copy; {new Date().getFullYear()} ERVI group. All rights reserved.</p>
      </div>

      <div className="footer-center">
        <p>Kontaktujte nás:</p>
        <p>Email: info@ervi-group.com</p>
        <p>Phone: +421 911 640 665</p>
      </div>

      <div className="footer-right">
        <p>
          <Link to="/ochrana-osobnych-udajov">Ochrana osobných údajov</Link>
        </p>
        <p>
          <Link to="/obchodne-podmienky">Obchodné podmienky</Link>
        </p>
        <p>
          <Link to="/reklamacny-poriadok">Reklamačný poriadok</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
