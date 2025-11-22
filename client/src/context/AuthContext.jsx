// FILE: stockmaster-frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 1. Rename this to be specific to initialization
  const [isInitializing, setIsInitializing] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsInitializing(false); // Done initializing
        return;
      }
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsInitializing(false); // Done initializing
      }
    };
    initAuth();
  }, []);

  // 2. REMOVE setLoading calls from login/register.
  // Let the UI components (Register.jsx/Login.jsx) handle their own spinners.
  
  const login = async (email, password) => {
    // setLoading(true);  <-- DELETE THIS
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return response.user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } 
    // finally { setLoading(false); } <-- DELETE THIS
  };

  const register = async (userData) => {
    // setLoading(true); <-- DELETE THIS
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
    } 
    // finally { setLoading(false); } <-- DELETE THIS
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading: isInitializing, // Expose as 'loading' if you want, or update consumers
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  // 3. Update the render condition
  if (isInitializing) {
    return (
      <div style={{ /* ...styles... */ }}>
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