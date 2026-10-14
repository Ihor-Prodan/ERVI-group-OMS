import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import CustomInput from '../../UI-elements/input/Input';
import Button from '../../UI-elements/button/Buttot';
import Loader from '../../UI-elements/loader/Loader';
import logo from '../../assets/LOGO-black.png';
import { changePassword, logout } from '../API/API';
import { useAuthStore } from '../../store/authStore';
import './ChangePasswordPage.css';

const PASSWORD_POLICY_MESSAGE =
  'Heslo musí mať aspoň 10 znakov a obsahovať malé aj veľké písmeno, číslicu a špeciálny znak.';

const isPasswordStrong = (password: string) => {
  if (password.length < 10) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
};

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, logoutUser } = useAuthStore();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordStrong(newPassword)) {
      setError(PASSWORD_POLICY_MESSAGE);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Nové heslo a potvrdenie sa nezhodujú.');
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      setUser(res.user);
      navigate(
        res.user.role === 'admin'
          ? '/admin/accepted'
          : res.user.role === 'company'
          ? '/admin/new-order'
          : '/admin/documents'
      );
    } catch (err: any) {
      setError(err.message || 'Heslo sa nepodarilo zmeniť.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore, log out locally regardless
    } finally {
      logoutUser();
      navigate('/');
    }
  };

  return (
    <div className="change-password-overlay">
      <div className="change-password-card">
        <img src={logo} alt="ERVI Group" className="change-password-logo" />
        <div className="change-password-eyebrow">PRVÉ PRIHLÁSENIE</div>
        <h2 className="change-password-title">Zmena hesla</h2>
        <p className="change-password-text">
          Z bezpečnostných dôvodov si musíte pred pokračovaním zmeniť dočasné heslo.
        </p>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="change-password-field">
            <Lock className="change-password-field-icon" size={18} />
            <CustomInput
              label="Dočasné heslo"
              type={showOld ? 'text' : 'password'}
              placeholder="Zadajte dočasné heslo"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="change-password-input"
            />
            <button
              type="button"
              className="change-password-field-toggle"
              onClick={() => setShowOld((v) => !v)}
              aria-label="Zobraziť heslo"
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="change-password-field">
            <Lock className="change-password-field-icon" size={18} />
            <CustomInput
              label="Nové heslo"
              type={showNew ? 'text' : 'password'}
              placeholder="Zadajte nové heslo"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="change-password-input"
            />
            <button
              type="button"
              className="change-password-field-toggle"
              onClick={() => setShowNew((v) => !v)}
              aria-label="Zobraziť heslo"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="change-password-hint">{PASSWORD_POLICY_MESSAGE}</p>

          <div className="change-password-field">
            <Lock className="change-password-field-icon" size={18} />
            <CustomInput
              label="Potvrdiť nové heslo"
              type={showNew ? 'text' : 'password'}
              placeholder="Zopakujte nové heslo"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="change-password-input"
            />
          </div>

          {error && <div className="change-password-notice">{error}</div>}

          <Button
            text={loading ? 'Ukladám...' : 'Zmeniť heslo'}
            variant="primary"
            size="md"
            disabled={loading}
            className="change-password-submit"
          />
        </form>

        <button type="button" className="change-password-logout" onClick={handleLogout}>
          Odhlásiť sa
        </button>
      </div>

      {loading && <Loader fullscreen={true} />}
    </div>
  );
};

export default ChangePasswordPage;
