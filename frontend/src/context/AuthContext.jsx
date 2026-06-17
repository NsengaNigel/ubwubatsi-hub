import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('ubwubatsi_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
    api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem('ubwubatsi_user', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('ubwubatsi_token');
        localStorage.removeItem('ubwubatsi_user');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('ubwubatsi_token', data.token);
    localStorage.setItem('ubwubatsi_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    localStorage.setItem('ubwubatsi_token', data.token);
    localStorage.setItem('ubwubatsi_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data);
      localStorage.setItem('ubwubatsi_user', JSON.stringify(data));
      return data;
    } catch {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('ubwubatsi_token');
    localStorage.removeItem('ubwubatsi_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isVerified: user?.isVerified === true,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
