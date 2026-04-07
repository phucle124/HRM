export type Role = 'admin' | 'manager' | 'hr' | 'employee';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}
export interface Employee {
  id: number;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  department: string;
  position: string;
  status: 'Đang làm' | 'Thử việc' | 'Nghỉ phép';
  joinDate: string;
  location: string;
  leaveBalance: number;
  avatar: string;
  avatarUrl?: string;
  birthDate?: string;
  idNumber?: string;
  address?: string;
  emergencyContact?: string;
}

export interface Department {
  id: number;
  name: string;
  manager: string;
  managerId?: number;
  totalEmployees: number;
  openPositions: number;
  budget: string;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Đúng giờ' | 'Đi muộn' | 'Làm từ xa' | 'Nghỉ phép';
  hours: number;
}

export interface SalaryRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowance: number;
  bonus: number;
  deduction: number;
  total: number;
  status: 'Đã thanh toán' | 'Chờ duyệt';
}

export interface LeaveRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  type: 'Phép năm' | 'Ốm' | 'Cá nhân';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
}

export interface ContractRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  contractType: 'Chính thức' | 'Thử việc' | 'Thời vụ';
  startDate: string;
  endDate: string;
  salary: number;
  status: 'Còn hiệu lực' | 'Sắp hết hạn' | 'Đã hết hạn';
}

export interface RewardRecord {
  id: number;
  employeeName: string;
  category: 'Khen thưởng' | 'Kỷ luật';
  title: string;
  date: string;
  amount: string;
  note: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
