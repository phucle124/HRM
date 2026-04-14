import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface AuthUser {
  id: number;
  name: string;
  email?: string;
  role: string;
  departmentName?: string;
  token?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. ĐỌC NGAY TỪ LOCAL STORAGE ĐỂ KHÔNG BỊ VĂNG KHI F5 HOẶC LƯU CODE
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = window.localStorage.getItem('hrm-demo-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [loading, setLoading] = useState(false);

  // 2. Chức năng checkSession vẫn giữ nhưng chỉ chạy khi thật sự cần
  useEffect(() => {
    const checkSession = async () => {
      // Nếu đã có user trong LocalStorage rồi thì KHÔNG CẦN hỏi lại Server để tránh bị đá văng
      if (user) return; 
      
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/session`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          const userData = data.data || data; 
          const nextUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          };
          setUser(nextUser);
          window.localStorage.setItem('hrm-demo-user', JSON.stringify(nextUser));
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (nextUser: AuthUser) => {
        setUser(nextUser);
        window.localStorage.setItem('hrm-demo-user', JSON.stringify(nextUser)); // Nhớ dai
      },
      logout: () => {
        setUser(null);
        window.localStorage.removeItem('hrm-demo-user'); // Xóa trí nhớ khi đăng xuất
      }
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