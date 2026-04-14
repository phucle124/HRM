import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useAuth } from './authContext';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface AppDataContextValue {
  users: any[];
  employees: any[];
  departments: any[];
  fetchUsers: () => Promise<void>;
  createUser: (data: any) => Promise<void>;
  updateUser: (id: number, data: any) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  lockUser: (id: number) => Promise<void>;
  fetchEmployees: () => Promise<void>;
  addEmployee: (data: any) => Promise<void>;
  updateEmployee: (id: number, data: any) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  // Thêm các hàm cho Department
  fetchDepartments: () => Promise<void>;
  createDepartment: (data: any) => Promise<void>;
  updateDepartment: (id: number, data: any) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
  assignManager: (departmentId: number, managerId: number) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  // Hàm mẫu cho fetch dữ liệu dùng Session
  const fetchWithSession = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // BẮT BUỘC: Để gửi session cookie
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }, []);

  /* =========================================
     PHẦN 1: ADMIN (USERS)
  ========================================= */
  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    try {
      const res = await fetchWithSession('/users');
      const result = await res.json();
      setUsers(result.data || []);
    } catch (err) { console.error('Lỗi tải Users', err); }
  }, [user, fetchWithSession]);

  const createUser = async (data: any) => {
    try {
      const res = await fetchWithSession('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.ok) await fetchUsers();
    } catch (err) { console.error(err); }
  };

  const updateUser = async (id: number, data: any) => {
    try {
      const res = await fetchWithSession(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      if (res.ok) await fetchUsers();
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetchWithSession(`/users/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchUsers();
    } catch (err) { console.error(err); }
  };

  const lockUser = async (id: number) => {
    try {
      const res = await fetchWithSession(`/users/${id}/lock`, { method: 'PATCH' });
      if (res.ok) await fetchUsers();
    } catch (err) { console.error(err); }
  };

  /* =========================================
     PHẦN 2: HR / MANAGER / ADMIN (EMPLOYEES)
  ========================================= */
  const fetchEmployees = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetchWithSession('/employees');
      const result = await res.json();
      setEmployees(result.data || []);
    } catch (err) { console.error('Lỗi tải nhân viên', err); }
  }, [user, fetchWithSession]);

  const addEmployee = async (data: any) => {
    try {
      const res = await fetchWithSession('/employees', { method: 'POST', body: JSON.stringify(data) });
      if (res.ok) await fetchEmployees();
    } catch (err) { console.error(err); }
  };

  const updateEmployee = async (id: number, data: any) => {
    try {
      const res = await fetchWithSession(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      if (res.ok) await fetchEmployees();
    } catch (err) { console.error(err); }
  };

  const deleteEmployee = async (id: number) => {
    try {
      const res = await fetchWithSession(`/employees/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchEmployees();
    } catch (err) { console.error(err); }
  };

  /* =========================================
     PHẦN 3: DEPARTMENTS (PHÒNG BAN)
  ========================================= */
  const fetchDepartments = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetchWithSession('/departments');
      const result = await res.json();
      const formatted = (result.data || []).map((d: any) => ({
        id: d.department_id,
        name: d.name,
        managerId: d.manager_id,
      }));
      setDepartments(formatted);
    } catch (err) { console.error(err); }
  }, [user, fetchWithSession]);

  const createDepartment = async (data: any) => {
    try {
      const res = await fetchWithSession('/departments', { method: 'POST', body: JSON.stringify(data) });
      if (res.ok) await fetchDepartments();
      else console.error('Lỗi tạo phòng ban:', await res.text());
    } catch (err) { console.error(err); }
  };

  const updateDepartment = async (id: number, data: any) => {
    try {
      const res = await fetchWithSession(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      if (res.ok) await fetchDepartments();
      else console.error('Lỗi cập nhật phòng ban:', await res.text());
    } catch (err) { console.error(err); }
  };

  const deleteDepartment = async (id: number) => {
    try {
      const res = await fetchWithSession(`/departments/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchDepartments();
      else console.error('Lỗi xóa phòng ban:', await res.text());
    } catch (err) { console.error(err); }
  };

  // Hàm gán trưởng phòng riêng biệt
  const assignManager = async (departmentId: number, managerId: number) => {
    try {
      const res = await fetchWithSession(`/manager/${departmentId}/assign`, { 
        method: 'PATCH', 
        body: JSON.stringify({ manager_id: managerId }) // Đảm bảo key gửi lên khớp với backend
      });
      if (res.ok) await fetchDepartments();
      else console.error('Lỗi gán trưởng phòng:', await res.text());
    } catch (err) { console.error(err); }
  };

  /* =========================================
     EFFECT TẢI DỮ LIỆU BAN ĐẦU
  ========================================= */
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        fetchUsers();
        fetchDepartments(); // Admin cũng cần tải danh sách phòng ban để xem/sửa
        fetchEmployees();
      } else {
        fetchEmployees();
        fetchDepartments();
      }
    }
  }, [user, fetchUsers, fetchEmployees, fetchDepartments]);

  const value = useMemo(
    () => ({
      users, employees, departments,
      fetchUsers, createUser, updateUser, deleteUser, lockUser,
      fetchEmployees, addEmployee, updateEmployee, deleteEmployee, 
      fetchDepartments, createDepartment, updateDepartment, deleteDepartment, assignManager
    }),
    [users, employees, departments, fetchUsers, fetchEmployees, fetchDepartments]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
}