import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import LandingHeader from './LandingHeader';
import type { ParcelStep } from '../orders/types';

interface SiteHeaderProps {
  onLoginClick: () => void;
  setParcelNumber: React.Dispatch<React.SetStateAction<string>>;
  parcelNumber: string;
  setSteps: React.Dispatch<React.SetStateAction<ParcelStep[]>>;
  steps: ParcelStep[];
}

const SiteHeader: React.FC<SiteHeaderProps> = (props) => {
  const { pathname } = useLocation();

  if (pathname === '/ervi-group') {
    return <LandingHeader onLoginClick={props.onLoginClick} />;
  }

  return <Header {...props} />;
};

export default SiteHeader;
