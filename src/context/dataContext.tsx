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
    if (!user?.token) return;
    try {
      const res = await fetch(`${BASE_URL}/departments`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const result = await res.json();
      const formatted = (result.data || []).map((d: any) => ({
        id: d.department_id,
        name: d.name,
        managerId: d.manager_id,
      }));
      setDepartments(formatted);
    } catch (err) {
      console.error('Lỗi tải phòng ban', err);
    }
  }, [user?.token]);

  const fetchEmployees = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const result = await res.json();
      setEmployees(result.data || []);
    } catch (err) {
      console.error('Lỗi tải nhân viên', err);
    }
  }, [user?.token]);

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