import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Eye, EyeOff, KeyRound, LayoutDashboard, LogOut, X } from 'lucide-react';
import './UserMenu.css';
import { changePassword, logout } from '../API/API';
import { useAuthStore } from '../../store/authStore';
import useAuth from '../../hooks/useAuth';
import Button from '../../UI-elements/button/Buttot';

interface UserMenuProps {
  goToApp?: { label: string; onClick: () => void };
}

const UserMenu: React.FC<UserMenuProps> = ({ goToApp }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logoutUser } = useAuthStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();

      logoutUser();
      navigate('/');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Nové heslo a potvrdenie sa nezhodujú');

      return;
    }

    setLoading(true);
    setError(null);

    try {
      await changePassword(oldPassword, newPassword);
      alert('Heslo úspešne zmenené');

      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Chyba pri zmene hesla');
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void
  ) => (
    <label className="account-field">
      <span className="account-field-label">{label}</span>
      <div className="account-password-wrapper">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="account-toggle-eye"
          onClick={() => setShow(!show)}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );

  const initial = (user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase();

  return (
    <div ref={wrapperRef} className="user-menu">
      <button type="button" className="user-menu-trigger" onClick={() => setOpen((v) => !v)}>
        <span className="user-menu-avatar">{initial}</span>
        <ChevronDown size={14} className={open ? 'is-open' : ''} />
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-email">{user?.email}</div>

          {goToApp && (
            <button
              type="button"
              className="user-menu-item"
              onClick={() => {
                setOpen(false);
                goToApp.onClick();
              }}
            >
              <LayoutDashboard size={16} /> {goToApp.label}
            </button>
          )}

          <button
            type="button"
            className="user-menu-item"
            onClick={() => {
              setOpen(false);
              setShowModal(true);
            }}
          >
            <KeyRound size={16} /> Zmeniť heslo
          </button>

          <button
            type="button"
            className="user-menu-item user-menu-item--danger"
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
          >
            <LogOut size={16} /> Odhlásiť sa
          </button>
        </div>
      )}

      {showModal && (
        <div className="account-modal-backdrop">
          <div className="account-modal">
            <button
              type="button"
              className="account-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Zavrieť"
            >
              <X size={18} />
            </button>

            <div className="account-modal-icon">
              <KeyRound size={22} />
            </div>

            <h3>Zmena hesla</h3>
            <p className="account-modal-subtitle">Zadajte staré heslo a nové heslo dvakrát pre potvrdenie.</p>

            {renderPasswordInput('Staré heslo', oldPassword, setOldPassword, showOld, setShowOld)}
            {renderPasswordInput('Nové heslo', newPassword, setNewPassword, showNew, setShowNew)}
            {renderPasswordInput(
              'Potvrdiť nové heslo',
              confirmPassword,
              setConfirmPassword,
              showConfirm,
              setShowConfirm
            )}

            {error && <p className="account-modal-error">{error}</p>}

            <div className="account-modal-actions">
              <Button text="Zrušiť" variant="secondary" onClick={() => setShowModal(false)} />
              <Button
                text={loading ? 'Čakajte...' : 'Zmeniť'}
                variant="primary"
                onClick={handlePasswordChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
