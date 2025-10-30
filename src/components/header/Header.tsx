import React, { useState } from 'react';
import './Header.css';
import Button from '../../UI-elements/button/Buttot';
import SearchInput from '../../UI-elements/searchInput/SearchInput';
import { useNavigate } from 'react-router-dom';
import { getOrderByTrackingNumber, logout } from '../API/API';
import { transformOrderToSteps } from '../tracking/transformOrder';
import type { ParcelStep } from '../orders/types';
import { useAuthStore } from '../../store/authStore';
import useAuth from '../../hooks/useAuth';
import Loader from '../../UI-elements/loader/Loader';

interface HeaderProps {
  onLoginClick: () => void;
  setParcelNumber: React.Dispatch<React.SetStateAction<string>>;
  parcelNumber: string;
  setSteps: React.Dispatch<React.SetStateAction<ParcelStep[]>>;
  steps: ParcelStep[];
}

const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  setParcelNumber,
  parcelNumber,
  setSteps,
}) => {
  const [hiddenBotField, setHiddenBotField] = useState('');
  const [loading, setLoading] = useState(false);
  const { logoutUser } = useAuthStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const onSearch = async () => {
    setLoading(true);

    if (hiddenBotField.trim() !== '') {
      console.warn('Bot detected!');

      return;
    }

    if (parcelNumber.trim().length === 0) {
      alert('Číslo objednávky nemôže byť prázdne.');
      setLoading(false);

      return;
    }
    if (parcelNumber.length > 50) {
      alert('Maximálna dĺžka čísla objednávky je 50 znakov.');
      setLoading(false);

      return;
    }

    if (!Number(parcelNumber) && isNaN(Number(parcelNumber))) {
      alert('Musíte zadať platné číslo objednávky.');
      setLoading(false);

      return;
    }

    try {
      const order = await getOrderByTrackingNumber(parcelNumber);
      setSteps(transformOrderToSteps(order));

      navigate(`/tracking?number=${parcelNumber}`);
      setParcelNumber('');
    } catch (err) {
      console.error('Chyba pri načítaní objednávky:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="header">
      <img className="header__logo" src="/src/assets/LOGO.jpg" alt="Logo" />

      <div className="header__actions">
        <SearchInput
          placeholder="Zadajte číslo objednávky..."
          onSearch={onSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setParcelNumber(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          value={parcelNumber}
        />
        <input
          type="text"
          name="website"
          value={hiddenBotField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHiddenBotField(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />
        {isAuthenticated ? (
          <Button text="Odhlásiť sa" variant="error" size="md" onClick={() => handleLogout()} />
        ) : (
          <Button text="Prihlásiť sa" variant="primary" size="md" onClick={onLoginClick} />
        )}
      </div>

      {loading && <Loader fullscreen={true} />}
    </header>
  );
};

export default Header;
