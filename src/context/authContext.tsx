import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface AuthUser {
  id: number;
  name: string;
  email?: string; // ✅ Thêm dấu ? ở đây
  role: string;
  departmentName?: string;
  token?: string,
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

  // Tự động kiểm tra Cookie mỗi khi vào web
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/session`, {
          method: 'GET',
          credentials: 'include', // Mang Cookie lên hỏi Backend
        });
        
        if (res.ok) {
          const data = await res.json();
          // Lấy thông tin user từ session
          const userData = data.data || data; 
          setUser({
  id: userData.id,
  name: userData.name,
  email: userData.email, // ✅ Thêm dòng này vào
  role: userData.role,
});
        } else {
          setUser(null);
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
  setUser(nextUser);
  // Vẫn lưu vào máy để khi F5 không bị mất trạng thái đăng nhập
  window.localStorage.setItem('hrm-demo-user', JSON.stringify(nextUser));
},
      logout: () => setUser(null), // Có thể thêm API gọi /logout để Backend xóa Cookie nếu cần
    }),
    [user]
  );

  // Hiện chữ loading trong lúc chờ Backend trả lời để tránh giật trang
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