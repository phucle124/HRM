import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import type { Role } from '../types/hrm';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface AuthUser {
  id: number;
  name: string;
  email?: string;
  role: Role; // Sử dụng type Role từ hrm.ts
  token?: string;
  isManager: boolean; // Bắt buộc có để nhận diện từ BE
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Tự động kiểm tra Session mỗi khi vào web
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/session`, {
          method: 'GET',
          credentials: 'include', // Quan trọng: Gửi Cookie lên BE
        });
        
        if (res.ok) {
          const data = await res.json();
          const userData = data.data || data; 

          // Logic nhận diện Manager từ cột isManager của BE
          const isManager = userData.isManager === true;
          
          const nextUser: AuthUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            // Nếu là manager thì ép role về 'manager' để App.tsx điều hướng đúng
            role: isManager ? 'manager' : (userData.role as Role),
            token: userData.token,
            isManager: isManager,
          };

          setUser(nextUser);
          // Cập nhật lại LocalStorage để dữ liệu luôn mới nhất
          window.localStorage.setItem('hrm-demo-user', JSON.stringify(nextUser));
        } else {
          setUser(null);
          window.localStorage.removeItem('hrm-demo-user');
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (nextUser: AuthUser) => {
        // Trước khi login, kiểm tra lại role manager lần cuối
        const finalUser = {
          ...nextUser,
          role: nextUser.isManager ? 'manager' : nextUser.role
        };
        setUser(finalUser as AuthUser);
        window.localStorage.setItem('hrm-demo-user', JSON.stringify(finalUser));
      },
      logout: () => {
        setUser(null);
        window.localStorage.removeItem('hrm-demo-user'); // Xóa sạch dấu vết
        // Nếu cần gọi API xóa session ở BE: fetch(`${BASE_URL}/logout`, { credentials: 'include' });
      },
    }),
    [user]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f1] text-gray-500 font-medium animate-pulse">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}