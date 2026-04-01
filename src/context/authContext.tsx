import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Role } from '../types/hrm';

interface AuthUser {
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = window.localStorage.getItem('hrm-demo-user');

      if (!raw) return null;

      return JSON.parse(raw);
    } catch {
      window.localStorage.removeItem('hrm-demo-user');
      return null;
    }
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,

      login: (nextUser: AuthUser) => {
        setUser(nextUser);
        window.localStorage.setItem('hrm-demo-user', JSON.stringify(nextUser));
      },

      logout: () => {
        setUser(null);
        window.localStorage.removeItem('hrm-demo-user');
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}