import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useAuth } from './authContext';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface AppDataContextValue {
  employees: any[];
  departments: any[];
  fetchDepartments: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  setDepartments: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const fetchDepartments = useCallback(async () => {
    // ĐÃ SỬA: Chỉ cần kiểm tra có user là gọi, không cần token
    if (!user) return; 
    try {
      const res = await fetch(`${BASE_URL}/departments`, {
        method: 'GET',
        credentials: 'include', // ĐÃ SỬA: Chìa khóa vàng Cookie
      });
      const result = await res.json();
      
      // Xử lý an toàn đề phòng Backend trả về data kiểu khác nhau
      const dataList = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
      
      const formatted = dataList.map((d: any) => ({
        id: d.department_id,
        name: d.name,
        managerId: d.manager_id,
      }));
      setDepartments(formatted);
    } catch (err) {
      console.error('Lỗi tải phòng ban', err);
    }
  }, [user]); // ĐÃ SỬA: Dependency chỉ là user

  const fetchEmployees = useCallback(async () => {
    // ĐÃ SỬA: Chỉ cần kiểm tra có user
    if (!user) return; 
    try {
      const res = await fetch(`${BASE_URL}/employees`, {
        method: 'GET',
        credentials: 'include', // ĐÃ SỬA: Chìa khóa vàng Cookie
      });
      const result = await res.json();
      
      // Xử lý an toàn dữ liệu
      const dataList = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
      setEmployees(dataList);
    } catch (err) {
      console.error('Lỗi tải nhân viên', err);
    }
  }, [user]); // ĐÃ SỬA: Dependency chỉ là user

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [fetchDepartments, fetchEmployees]);

  const value = useMemo(
    () => ({ employees, departments, fetchDepartments, fetchEmployees, setDepartments }),
    [employees, departments, fetchDepartments, fetchEmployees]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
}