import React, { useState } from 'react';
import './Header.css';
import SearchInput from '../../UI-elements/searchInput/SearchInput';
import { useNavigate } from 'react-router-dom';
import { getOrderByTrackingNumber } from '../API/API';
import { transformOrderToSteps } from '../tracking/transformOrder';
import type { ParcelStep } from '../orders/types';
import useAuth from '../../hooks/useAuth';
import Loader from '../../UI-elements/loader/Loader';
import logo from '../../assets/LOGO-white.png';
import UserMenu from './UserMenu';

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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

    const validNumberRegex = /^(?! )(?!.* $)[0-9 ]+$/;

    if (!validNumberRegex.test(parcelNumber)) {
      alert('Musíte zadať platné číslo objednávky.');

      setLoading(false);
      return;
    }

    try {
      const order = await getOrderByTrackingNumber(parcelNumber);
      setSteps(transformOrderToSteps(order));

      navigate(`/tracking?number=${parcelNumber}`);
      setParcelNumber('');
    } catch (err: any) {
      console.error('Chyba pri načítaní objednávky:', err);

      alert(err.message || 'Chyba pri načítaní objednávky.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="Logo"
        onClick={() => navigate('/ervi-group')}
      />

      <div className="header__actions">
        <SearchInput
          placeholder="Zadajte číslo DL..."
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
          <UserMenu />
        ) : (
          <button className="header__login" onClick={onLoginClick}>
            Prihlásiť sa
          </button>
        )}
      </div>

      {loading && <Loader fullscreen={true} />}
    </header>
  );
};

export default Header;
