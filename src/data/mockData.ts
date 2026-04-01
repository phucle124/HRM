import type {
  AttendanceRecord,
  ContractRecord,
  Department,
  Employee,
  LeaveRecord,
  NavItem,
  RewardRecord,
  SalaryRecord,
} from '../types/hrm';

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'layout-dashboard' },
  { label: 'Nhân viên', path: '/admin/employees', icon: 'users' },
  { label: 'Phòng ban', path: '/admin/departments', icon: 'building-2' },
  { label: 'Chấm công', path: '/admin/attendance', icon: 'calendar-days' },
  { label: 'Lương', path: '/admin/salary', icon: 'wallet' },
  { label: 'Nghỉ phép', path: '/admin/leave', icon: 'plane' },
  { label: 'Hợp đồng', path: '/admin/contracts', icon: 'file-text' },
  { label: 'Khen thưởng', path: '/admin/rewards', icon: 'award' },
  { label: 'Báo cáo', path: '/admin/reports', icon: 'bar-chart-3' },
  { label: 'Cài đặt', path: '/admin/settings', icon: 'settings' },
];

export const managerNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/manager/dashboard', icon: 'layout-dashboard' },
  { label: 'Nhân viên', path: '/manager/employees', icon: 'users' },
  { label: 'Phòng ban', path: '/manager/departments', icon: 'building-2' },
  { label: 'Chấm công', path: '/manager/attendance', icon: 'calendar-days' },
  { label: 'Nghỉ phép', path: '/manager/leave', icon: 'plane' },
  { label: 'Lương', path: '/manager/salary', icon: 'wallet' },
  { label: 'Khen thưởng', path: '/manager/rewards', icon: 'award' },
];

export const hrNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/hr', icon: 'layout-dashboard' },
  { label: 'Employees', path: '/hr/employees', icon: 'users' },
  { label: 'Departments', path: '/hr/departments', icon: 'building-2' },
  { label: 'Attendance', path: '/hr/attendance', icon: 'calendar-days' },
  { label: 'Salary', path: '/hr/salary', icon: 'wallet' },
  { label: 'Leave', path: '/hr/leave', icon: 'plane' },
  { label: 'Contracts', path: '/hr/contracts', icon: 'file-text' },
  { label: 'Rewards', path: '/hr/rewards', icon: 'award' },
  { label: 'Reports', path: '/hr/reports', icon: 'bar-chart-3' },
];

export const employeeNavItems: NavItem[] = [
  { label: 'Hồ sơ', path: '/employee', icon: 'user-circle' },
  { label: 'Chấm công', path: '/employee/attendance', icon: 'calendar-days' },
  { label: 'Lương', path: '/employee/salary', icon: 'wallet' },
  { label: 'Nghỉ phép', path: '/employee/leave', icon: 'plane' },
  { label: 'Hợp đồng', path: '/employee/contract', icon: 'file-text' },
];

export const employees: Employee[] = [
  {
    id: 1,
    code: 'EMP-001',
    fullName: 'Nguyễn Hoàng Minh',
    email: 'minh.nguyen@hrm.vn',
    phone: '0901 123 456',
    gender: 'Nam',
    department: 'Nhân sự',
    position: 'HR Manager',
    status: 'Đang làm',
    joinDate: '2022-04-12',
    location: 'Hồ Chí Minh',
    leaveBalance: 8,
    avatar: 'NH',
    birthDate: '1994-09-21',
    idNumber: '079094001234',
    address: 'Quận 3, TP. Hồ Chí Minh',
    emergencyContact: 'Nguyễn Thị Lan · 0908 888 222',
  },

  {
    id: 2,
    code: 'EMP-002',
    fullName: 'Trần Thu Hà',
    email: 'ha.tran@hrm.vn',
    phone: '0912 456 888',
    gender: 'Nữ',
    department: 'Kế toán',
    position: 'Payroll Specialist',
    status: 'Đang làm',
    joinDate: '2023-01-08',
    location: 'Hà Nội',
    leaveBalance: 10,
    avatar: 'TH',
    birthDate: '1996-11-04',
    idNumber: '001196002345',
    address: 'Cầu Giấy, Hà Nội',
    emergencyContact: 'Trần Văn Quang · 0911 111 456',
  },

  {
    id: 3,
    code: 'EMP-003',
    fullName: 'Lê Văn Nam',
    email: 'nam.le@hrm.vn',
    phone: '0909 123 123',
    gender: 'Nam',
    department: 'Nhân sự',
    position: 'HR Staff',
    status: 'Đang làm',
    joinDate: '2024-01-10',
    location: 'Hồ Chí Minh',
    leaveBalance: 6,
    avatar: 'LN',
    birthDate: '1998-02-14',
    idNumber: '079098001111',
    address: 'Quận 10, TP. Hồ Chí Minh',
    emergencyContact: 'Lê Thị Mai · 0909 999 111',
  },

  {
    id: 4,
    code: 'EMP-004',
    fullName: 'Phạm Thị Hương',
    email: 'huong.pham@hrm.vn',
    phone: '0908 456 789',
    gender: 'Nữ',
    department: 'Nhân sự',
    position: 'Recruiter',
    status: 'Đang làm',
    joinDate: '2024-02-15',
    location: 'Hồ Chí Minh',
    leaveBalance: 5,
    avatar: 'PH',
    birthDate: '1997-07-09',
    idNumber: '079097002222',
    address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    emergencyContact: 'Phạm Văn Long · 0908 888 444',
  },
  {
  id: 5,
  code: 'EMP-005',
  fullName: 'Nguyễn Văn A',
  email: 'employee@gmail.com',
  phone: '0907 111 222',
  gender: 'Nam',
  department: 'Nhân sự',
  position: 'Nhân viên',
  status: 'Đang làm',
  joinDate: '2025-01-10',
  location: 'Hồ Chí Minh',
  leaveBalance: 7,
  avatar: 'VA',
  birthDate: '1999-05-12',
  idNumber: '079099003333',
  address: 'Quận 7, TP. Hồ Chí Minh',
  emergencyContact: 'Nguyễn Văn B · 0908 999 777',
}
];


export const departments: Department[] = [
  {
    id: 1,
    name: 'Nhân sự',
    manager: 'Nguyễn Hoàng Minh',
    totalEmployees: 12,
    openPositions: 2,
    budget: '180.000.000đ',
  },
  {
    id: 2,
    name: 'Kế toán',
    manager: 'Trần Thu Hà',
    totalEmployees: 8,
    openPositions: 1,
    budget: '120.000.000đ',
  },
  {
    id: 3,
    name: 'Kỹ thuật',
    manager: 'Lê Văn Nam',
    totalEmployees: 15,
    openPositions: 3,
    budget: '300.000.000đ',
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Nguyễn Hoàng Minh',
    date: '2026-03-19',
    checkIn: '08:01',
    checkOut: '17:35',
    status: 'Đúng giờ',
    hours: 8.5,
  },

  {
    id: 2,
    employeeId: 3,
    employeeName: 'Lê Văn Nam',
    date: '2026-03-19',
    checkIn: '08:10',
    checkOut: '17:30',
    status: 'Trễ',
    hours: 8,
  },

  {
    id: 3,
    employeeId: 4,
    employeeName: 'Phạm Thị Hương',
    date: '2026-03-19',
    checkIn: '07:58',
    checkOut: '17:25',
    status: 'Đúng giờ',
    hours: 8.5,
  },

  {
    id: 4,
    employeeId: 2,
    employeeName: 'Trần Thu Hà',
    date: '2026-03-19',
    checkIn: '08:05',
    checkOut: '17:40',
    status: 'Đúng giờ',
    hours: 8.5,
  },
];

export const salaryRecords: SalaryRecord[] = [
  
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Nguyễn Hoàng Minh',
    month: '03/2026',
    basicSalary: 25000000,
    allowance: 2500000,
    bonus: 3000000,
    deduction: 500000,
    total: 30000000,
    status: 'Đã thanh toán',
  },
  {
    id: 2,
    employeeId: 5,
    employeeName: 'Nguyễn Văn A',
    month: '03/2026',
    basicSalary: 12000000,
    allowance: 1000000,
    bonus: 500000,
    deduction: 200000,
    total: 13300000,
    status: 'Đã thanh toán',
  },
];


export const leaveRecords: LeaveRecord[] = [
  {
    id: 2,
    employeeId: 3,
    employeeName: 'Lê Văn Nam',
    type: 'Phép năm',
    startDate: '2026-03-21',
    endDate: '2026-03-22',
    days: 2,
    reason: 'Việc cá nhân',
    status: 'Chờ duyệt',
  },
  {
    id: 3,
    employeeId: 4,
    employeeName: 'Phạm Thị Hương',
    type: 'Nghỉ bệnh',
    startDate: '2026-03-23',
    endDate: '2026-03-23',
    days: 1,
    reason: 'Sức khỏe',
    status: 'Chờ duyệt',
  },
];

export const contractRecords: ContractRecord[] = [
 
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Nguyễn Hoàng Minh',
    contractType: 'Chính thức',
    startDate: '2025-04-12',
    endDate: '2027-04-11',
    salary: 25000000,
    status: 'Còn hiệu lực',
  },
  {
    id: 2,
    employeeId: 5,
    employeeName: 'Nguyễn Văn A',
    contractType: 'Chính thức',
    startDate: '2025-01-10',
    endDate: '2027-01-10',
    salary: 12000000,
    status: 'Còn hiệu lực',
  },

];

export const rewardRecords: RewardRecord[] = [
  {
    id: 2,
    employeeName: 'Lê Văn Nam',
    category: 'Kỷ luật',
    title: 'Đi trễ nhiều lần',
    date: '2026-03-18',
    amount: '-500.000đ',
    note: 'Vi phạm giờ giấc',
  },
  {
    id: 3,
    employeeName: 'Phạm Thị Hương',
    category: 'Khen thưởng',
    title: 'Hoàn thành tuyển dụng tốt',
    date: '2026-03-17',
    amount: '+1.500.000đ',
    note: 'Hiệu suất tốt',
  },
];

export const employeeRecords = [
  {
    id: 1,
    name: 'Nguyễn Hoàng Minh',
    department: 'IT',
    position: 'Frontend Developer',
  },
  {
    id: 2,
    name: 'Trần Thị Lan',
    department: 'HR',
    position: 'HR Manager',
  },
];

export const attendanceRecord = [
  {
    id: 1,
    employeeName: 'Nguyễn Hoàng Minh',
    days: 26,
    late: 1,
  },
  {
    id: 2,
    employeeName: 'Trần Thị Lan',
    days: 24,
    late: 0,
  },
];

export const salaryRecord = [
  {
    id: 2,
    employeeId: 3,
    employeeName: 'Lê Văn Nam',
    month: '03/2026',
    basicSalary: 18000000,
    allowance: 1000000,
    bonus: 500000,
    deduction: 200000,
    total: 19300000,
    status: 'Đã thanh toán',
  },
  {
    id: 3,
    employeeId: 4,
    employeeName: 'Phạm Thị Hương',
    month: '03/2026',
    basicSalary: 17000000,
    allowance: 1200000,
    bonus: 300000,
    deduction: 100000,
    total: 18400000,
    status: 'Đã thanh toán',
  },
];

export const leaveRecord = [
  {
    id: 1,
    employeeName: 'Nguyễn Hoàng Minh',
    leave: 2,
    contract: 'Còn hiệu lực',
  },
  {
    id: 2,
    employeeName: 'Trần Thị Lan',
    leave: 1,
    contract: 'Sắp hết hạn',
  },
];

export const hrStats = [
  { label: 'Tổng nhân viên', value: '55', change: '+12%' },
  { label: 'Đi làm hôm nay', value: '48', change: '87%' },
  { label: 'Đơn nghỉ phép', value: '06', change: '2 cần duyệt' },
  { label: 'Quỹ lương', value: '1.24 tỷ', change: '92%' },
];

export const employeeStats = [
  { label: 'Ngày công', value: '18', change: '2 remote' },
  { label: 'Phép còn lại', value: '06', change: '03/2026' },
];

export const departmentPerformance = [
  { name: 'Nhân sự', value: 72 },
  { name: 'Kế toán', value: 65 },
  { name: 'Kỹ thuật', value: 92 },
];

export const monthlyAttendance = [
  { month: 'T1', value: 86 },
  { month: 'T2', value: 90 },
  { month: 'T3', value: 94 },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

export const brand = {
  name: 'HRM System',
};