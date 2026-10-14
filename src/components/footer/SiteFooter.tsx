import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

const SiteFooter: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin') || pathname === '/change-password') {
    return null;
  }

  return <Footer />;
};

export default SiteFooter;
