import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { login } from '../API/API';
import useAuth from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';

interface LoginHandlerProps {
  onClose: () => void;
}

const LoginHandler: React.FC<LoginHandlerProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { isAuthenticated } = useAuth();

  const handleLogin = async (data: { email: string; password: string; honeypot: string }) => {
    setLoading(true);
    if (data.honeypot) {
      console.warn('Bot detected');

      return;
    }

    if (!data.email || !data.password) {
      alert('Prosím, vyplňte všetky polia.');
      setLoading(false);

      return;
    }

    if (isAuthenticated) {
      alert('Už ste prihlásený.');
      setLoading(false);

      onClose();
      return;
    }

    try {
      const res = await login(data.email, data.password);

      if (res?.ok && res.user) {
        setUser(res.user);
        onClose();
        navigate('/admin/new');
      } else {
        alert('Chyba prihlásenia, skúste znova.');
      }
    } catch (err) {
      console.error(err);

      alert('Chyba prihlásenia, skúste znova');
    } finally {
      setLoading(false);
    }
  };

  return <LoginModal onSubmit={handleLogin} onClose={onClose} loading={loading} />;
};

export default LoginHandler;
