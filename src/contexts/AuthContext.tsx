import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  login: () => void;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Set to 'mock-token' to skip login, or null to show login page
  const [token, setToken] = useState<string>('mock-token');
  const [user] = useState({
    id: 'demo-user',
    display_name: 'Demo User',
    email: 'demo@example.com'
  });

  const login = () => {
    setToken('mock-token');
    console.log('Mock login successful!');
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};