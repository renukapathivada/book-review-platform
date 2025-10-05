import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded.user);
        }
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    const decoded = jwtDecode(token);
    setUser(decoded.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    window.location.href = '/login';
  };

  const authData = { user, token, login, logout, isAuthenticated: !!token, loading };
  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);