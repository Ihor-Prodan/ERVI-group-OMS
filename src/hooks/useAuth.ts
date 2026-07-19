import { useEffect, useState } from 'react';
import { checkAuth } from '../components/API/API';
import { useAuthStore } from '../store/authStore';

const useAuth = () => {
  const { user, setUser, logoutUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const data = await checkAuth();
        if (data?.ok && data.user) {
          setUser(data.user);
        } else {
          logoutUser();
        }
      } catch {
        logoutUser();
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuth();
  }, [setUser, logoutUser]);

  return { isAuthenticated: !!user, user, isAdmin: user?.role === 'admin', isLoading };
};

export default useAuth;
