import React from 'react';
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
    </footer>
  );
};

export default Footer;
