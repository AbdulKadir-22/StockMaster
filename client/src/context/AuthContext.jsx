// FILE: stockmaster-frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Token exists, verify it by fetching user details
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        // If token is invalid/expired, clear it
        localStorage.removeItem('token');
        setUser(null);
        setError('Session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      
      // Assuming response contains { token, user }
      if (response.token) {
        localStorage.setItem('token', response.token);
        // If the login response doesn't return the full user object, 
        // we might need to call getMe() here. Assuming it does for now.
        setUser(response.user);
        return response.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return response.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optional: window.location.href = '/login'; 
    // (Better handled by the Router listening to the user state)
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  if (loading) {
    // Simple loading state as requested
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'var(--font-heading)',
        color: 'var(--color-primary)'
      }}>
        Loading StockMaster...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;