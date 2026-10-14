import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import CustomInput from '../../UI-elements/input/Input';
import Button from '../../UI-elements/button/Buttot';
import './LoginModal.css';
import Loader from '../../UI-elements/loader/Loader';
import logo from '../../assets/LOGO-black.png';

interface LoginModalProps {
  onSubmit: (data: { email: string; password: string; honeypot: string }) => void;
  onClose: () => void;
  loading: boolean;
  error?: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ onSubmit, onClose, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, honeypot });
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>

        <img src={logo} alt="ERVI Group" className="login-logo" />

        <div className="login-eyebrow">VITAJTE SPÄŤ</div>
        <h2 className="login-title">Prihlásenie</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="password-wrapper">
            <Mail className="login-field-icon" size={18} />
            <CustomInput
              label="Email"
              type="email"
              placeholder="Zadajte email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input--has-icon"
            />
          </div>

          <div className="password-wrapper">
            <Lock className="login-field-icon" size={18} />
            <CustomInput
              label="Heslo"
              type={showPassword ? 'text' : 'password'}
              placeholder="Zadajte heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input--has-icon login-input--has-toggle"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Zobraziť heslo"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="honeypot-input"
            autoComplete="off"
            tabIndex={-1}
          />

          {error && <div className="login-notice">{error}</div>}

          <Button
            text="Prihlásiť sa"
            variant="primary"
            size="md"
            disabled={loading}
            className="login-submit"
          />
        </form>
      </div>

      {loading && <Loader fullscreen={true} />}
    </div>
  );
};

export default LoginModal;
