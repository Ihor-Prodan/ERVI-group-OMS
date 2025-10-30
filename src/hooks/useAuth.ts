import { useEffect } from 'react';
import { checkAuth } from '../components/API/API';
import { useAuthStore } from '../store/authStore';

const useAuth = () => {
  const { user, setUser, logoutUser } = useAuthStore();

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
      }
    };

    fetchAuth();
  }, [setUser, logoutUser]);

  return { isAuthenticated: !!user, user };
};

export default useAuth;
