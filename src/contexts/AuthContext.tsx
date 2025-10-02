import { useState, useEffect, ReactNode } from 'react';
import { authContext, USERS, User } from '@/lib/auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('lovelyUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('lovelyUser');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Find user by matching username and password
    const userData = Object.values(USERS).find(user => 
      user.username === username && user.password === password
    );
    
    if (userData) {
      const loggedInUser = {
        username: userData.username,
        role: userData.role
      };
      setUser(loggedInUser);
      localStorage.setItem('lovelyUser', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lovelyUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};