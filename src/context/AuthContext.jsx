import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const login = (username, password) => {
    // Credenciales temporales mientras se desarrolla el backend
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setError('');
      return true;
    } else {
      setError('Credenciales inválidas');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}