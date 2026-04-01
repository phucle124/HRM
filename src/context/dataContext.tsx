import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  attendanceRecords as initialAttendance,
  contractRecords as initialContracts,
  departments as initialDepartments,
  employees as initialEmployees,
  leaveRecords as initialLeaves,
  rewardRecords as initialRewards,
  salaryRecords as initialSalaries,
} from '../data/mockData';
import type { AttendanceRecord, ContractRecord, Department, Employee, LeaveRecord, RewardRecord, SalaryRecord } from '../types/hrm';

interface NewEmployeePayload {
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  department: string;
  position: string;
  status: Employee['status'];
  joinDate: string;
  location: string;
}

interface NewDepartmentPayload {
  name: string;
  manager: string;
  totalEmployees: number;
  openPositions: number;
  budget: string;
}

interface NewContractPayload {
  employeeId: number;
  contractType: ContractRecord['contractType'];
  startDate: string;
  endDate: string;
  salary: number;
}

interface NewDecisionPayload {
  employeeName: string;
  category: RewardRecord['category'];
  title: string;
  date: string;
  amount: string;
  note: string;
}

interface RunPayrollPayload {
  month: string;
  allowance: number;
  bonus: number;
  deduction: number;
}

interface AppDataContextValue {
  employees: Employee[];
  departments: Department[];
  attendanceRecords: AttendanceRecord[];
  salaryRecords: SalaryRecord[];
  leaveRecords: LeaveRecord[];
  contractRecords: ContractRecord[];
  rewardRecords: RewardRecord[];
  currentEmployee: Employee;
  currentEmployeeSalary: SalaryRecord;
  currentEmployeeContract: ContractRecord | null;
  currentEmployeeAttendance: AttendanceRecord[];
  currentEmployeeLeaves: LeaveRecord[];
  addEmployee: (payload: NewEmployeePayload) => void;
  addDepartment: (payload: NewDepartmentPayload) => void;
  addContract: (payload: NewContractPayload) => void;
  addDecision: (payload: NewDecisionPayload) => void;
  runPayroll: (payload: RunPayrollPayload) => void;
  updateEmployeeAvatar: (employeeId: number, avatarUrl: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);
const CURRENT_EMPLOYEE_ID = 3;

const initialsFromName = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

const nextId = (items: { id: number }[]) => (items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [attendanceRecords] = useState<AttendanceRecord[]>(initialAttendance);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(initialSalaries);
  const [leaveRecords] = useState<LeaveRecord[]>(initialLeaves);
  const [contractRecords, setContractRecords] = useState<ContractRecord[]>(initialContracts);
  const [rewardRecords, setRewardRecords] = useState<RewardRecord[]>(initialRewards);

  const currentEmployee = useMemo(
    () => employees.find((item) => item.id === CURRENT_EMPLOYEE_ID) ?? employees[0],
    [employees],
  );

  const currentEmployeeSalary = useMemo(
    () => salaryRecords.find((item) => item.employeeId === currentEmployee.id) ?? salaryRecords[0],
    [currentEmployee.id, salaryRecords],
  );

  const currentEmployeeContract = useMemo(
    () => contractRecords.find((item) => item.employeeId === currentEmployee.id) ?? null,
    [contractRecords, currentEmployee.id],
  );

  const currentEmployeeAttendance = useMemo(
    () => attendanceRecords.filter((item) => item.employeeId === currentEmployee.id),
    [attendanceRecords, currentEmployee.id],
  );

  const currentEmployeeLeaves = useMemo(
    () => leaveRecords.filter((item) => item.employeeId === currentEmployee.id),
    [leaveRecords, currentEmployee.id],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      employees,
      departments,
      attendanceRecords,
      salaryRecords,
      leaveRecords,
      contractRecords,
      rewardRecords,
      currentEmployee,
      currentEmployeeSalary,
      currentEmployeeContract,
      currentEmployeeAttendance,
      currentEmployeeLeaves,
      addEmployee: (payload) => {
        const employee: Employee = {
          id: nextId(employees),
          code: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
          leaveBalance: 12,
          avatar: initialsFromName(payload.fullName),
          birthDate: '',
          idNumber: '',
          address: '',
          emergencyContact: '',
          ...payload,
        };
        setEmployees((prev) => [employee, ...prev]);
      },
      addDepartment: (payload) => {
        const department: Department = { id: nextId(departments), ...payload };
        setDepartments((prev) => [department, ...prev]);
      },
      addContract: (payload) => {
        const employee = employees.find((item) => item.id === payload.employeeId);
        if (!employee) return;
        const contract: ContractRecord = {
          id: nextId(contractRecords),
          employeeId: employee.id,
          employeeName: employee.fullName,
          contractType: payload.contractType,
          startDate: payload.startDate,
          endDate: payload.endDate,
          salary: payload.salary,
          status: 'Còn hiệu lực',
        };
        setContractRecords((prev) => [contract, ...prev]);
      },
      addDecision: (payload) => {
        const decision: RewardRecord = { id: nextId(rewardRecords), ...payload };
        setRewardRecords((prev) => [decision, ...prev]);
      },
      runPayroll: (payload) => {
        const monthlyRecords = employees.map((employee) => {
          const basicSalary = 12000000 + employee.id * 1500000;
          const total = basicSalary + payload.allowance + payload.bonus - payload.deduction;
          return {
            id: Math.floor(Math.random() * 1000000) + employee.id,
            employeeId: employee.id,
            employeeName: employee.fullName,
            month: payload.month,
            basicSalary,
            allowance: payload.allowance,
            bonus: payload.bonus,
            deduction: payload.deduction,
            total,
            status: 'Chờ duyệt' as const,
          };
        });

        setSalaryRecords((prev) => {
          const rest = prev.filter((item) => item.month !== payload.month);
          return [...monthlyRecords, ...rest];
        });
      },
      updateEmployeeAvatar: (employeeId, avatarUrl) => {
        setEmployees((prev) => prev.map((item) => (item.id === employeeId ? { ...item, avatarUrl } : item)));
      },
    }),
    [attendanceRecords, contractRecords, currentEmployee, currentEmployeeAttendance, currentEmployeeContract, currentEmployeeLeaves, departments, employees, leaveRecords, rewardRecords, salaryRecords],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
