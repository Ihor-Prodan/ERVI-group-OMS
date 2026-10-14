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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { isAuthenticated } = useAuth();

  const handleLogin = async (data: { email: string; password: string; honeypot: string }) => {
    setError(null);

    if (data.honeypot) {
      console.warn('Bot detected');

      return;
    }

    if (!data.email || !data.password) {
      setError('Prosím, vyplňte všetky polia.');

      return;
    }

    if (isAuthenticated) {
      onClose();
      return;
    }

    setLoading(true);

    try {
      const res = await login(data.email, data.password);

      if (res?.ok && res.user) {
        setUser(res.user);
        onClose();

        if (res.user.mustChangePassword) {
          navigate('/change-password');
        } else {
          navigate(
            res.user.role === 'admin'
              ? '/admin/accepted'
              : res.user.role === 'company'
              ? '/admin/new-order'
              : '/admin/documents'
          );
        }
      } else {
        setError('Chyba prihlásenia, skúste znova.');
      }
    } catch (err: any) {
      console.error(err);

      setError(err.message || 'Chyba prihlásenia, skúste znova.');
    } finally {
      setLoading(false);
    }
  };

  return <LoginModal onSubmit={handleLogin} onClose={onClose} loading={loading} error={error} />;
};

export default LoginHandler;
