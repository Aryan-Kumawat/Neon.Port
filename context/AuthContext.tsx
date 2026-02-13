import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState } from '../types';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Hardcoded credentials for demo purposes
const ADMIN_EMAIL = "admin@neonfolio.com";
const ADMIN_PASS = "admin123";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthState['user']>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('folio_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, pass: string) => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const mockUser = {
        name: "Admin User",
        email: email,
        photoURL: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
      };
      setUser(mockUser);
      localStorage.setItem('folio_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('folio_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
