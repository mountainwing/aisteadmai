import { createContext } from 'react';

export type UserRole = 'boyfriend' | 'girlfriend';

export interface User {
  username: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export const authContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials for the two users
export const USERS = {
  boyfriend: { username: 'boyfriend', password: 'mylovesecret', role: 'boyfriend' as UserRole },
  girlfriend: { username: 'girlfriend', password: 'ourlovesecret', role: 'girlfriend' as UserRole },
};