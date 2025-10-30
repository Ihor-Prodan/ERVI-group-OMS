import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import CustomInput from '../../UI-elements/input/Input';
import Button from '../../UI-elements/button/Buttot';
import './LoginModal.css';
import Loader from '../../UI-elements/loader/Loader';

interface LoginModalProps {
  onSubmit: (data: { email: string; password: string; honeypot: string }) => void;
  onClose: () => void;
  loading: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onSubmit, onClose, loading }) => {
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
          <X size={28} />
        </button>

        <h2 className="login-title">Prihlásenie</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="password-wrapper">
            <CustomInput
              label="Email"
              type="email"
              placeholder="Zadajte email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="password-wrapper">
            <CustomInput
              label="Heslo"
              type={showPassword ? 'text' : 'password'}
              placeholder="Zadajte heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <Button text="Prihlásiť sa" variant="primary" size="md" />
        </form>
      </div>

      {loading && <Loader fullscreen={true} />}
    </div>
  );
};

export default LoginModal;
