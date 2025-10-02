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
  boyfriend: { username: 'boyboy', password: 'ethanethan', role: 'boyfriend' as UserRole },
  girlfriend: { username: 'girlgirl', password: 'cherylcheryl', role: 'girlfriend' as UserRole },
};