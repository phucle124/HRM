import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';

/* HR */
import DashboardPage from './pages/HR/DashboardPage';
import EmployeesPage from './pages/HR/EmployeesPage';
import DepartmentsPage from './pages/HR/DepartmentsPage';
import AttendancePage from './pages/HR/AttendancePage';
import SalaryPage from './pages/HR/SalaryPage';
import LeavePage from './pages/HR/LeavePage';
import ContractsPage from './pages/HR/ContractsPage';
import RewardsPage from './pages/HR/RewardsPage';
import ReportsPage from './pages/HR/ReportsPage';

/* EMPLOYEE */
import ProfilePage from './pages/EMPLOYEE/ProfilePage';
import MyAttendancePage from './pages/EMPLOYEE/MyAttendancePage';
import MySalaryPage from './pages/EMPLOYEE/MySalaryPage';
import MyLeavePage from './pages/EMPLOYEE/MyLeavePage';
import MyContractPage from './pages/EMPLOYEE/MyContractPage';

/* ADMIN */
import AdminDashboardPage from './pages/ADMIN/AdminDashboardPage';
import EmployeesADPage from './pages/ADMIN/EmployeesADPage';
import DepartmentsADPage from './pages/ADMIN/DepartmentsADPage';
import AttendanceADPage from './pages/ADMIN/AttendanceADPage';
import SalaryADPage from './pages/ADMIN/SalaryADPage';
import LeaveADPage from './pages/ADMIN/LeavesADPage';
import ContractsADPage from './pages/ADMIN/ContractsADPage';
import RewardsADPage from './pages/ADMIN/RewardsADPage';
import ReportsADPage from './pages/ADMIN/ReportsADPage';
import SettingsADPage from './pages/ADMIN/SettingsADPage';

/* MANAGER */
import DashboardMNPage from './pages/MANAGER/DashboardMNPage';
import EmployeesMNPage from './pages/MANAGER/EmployeesMNPage';
import DepartmentsMNPage from './pages/MANAGER/DepartmentsMNPage';
import AttendanceMNPage from './pages/MANAGER/AttendanceMNPage';
import LeaveMNPage from './pages/MANAGER/LeaveMNPage';
import SalaryMNPage from './pages/MANAGER/SalaryMNPage';
import RewardsMNPage from './pages/MANAGER/RewardsMNPage';

import { AppLayout } from './components/layout';
import { useAuth } from './context/authContext';
import type { Role } from './types/hrm';

function ProtectedRoute({ role }: { role: Role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'hr') return <Navigate to="/hr" replace />;
    if (user.role === 'manager') return <Navigate to="/manager/dashboard" replace />;

    return <Navigate to="/employee" replace />;
  }

  return (
    <AppLayout role={role}>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<LoginPage />} />

      {/* ADMIN */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/employees" element={<EmployeesADPage />} />
        <Route path="/admin/departments" element={<DepartmentsADPage />} />
        <Route path="/admin/attendance" element={<AttendanceADPage />} />
        <Route path="/admin/salary" element={<SalaryADPage />} />
        <Route path="/admin/leave" element={<LeaveADPage />} />
        <Route path="/admin/contracts" element={<ContractsADPage />} />
        <Route path="/admin/rewards" element={<RewardsADPage />} />
        <Route path="/admin/reports" element={<ReportsADPage />} />
        <Route path="/admin/settings" element={<SettingsADPage />} />
      </Route>

      {/* HR */}
      <Route element={<ProtectedRoute role="hr" />}>
        <Route path="/hr" element={<DashboardPage />} />
        <Route path="/hr/employees" element={<EmployeesPage />} />
        <Route path="/hr/departments" element={<DepartmentsPage />} />
        <Route path="/hr/attendance" element={<AttendancePage />} />
        <Route path="/hr/salary" element={<SalaryPage />} />
        <Route path="/hr/leave" element={<LeavePage />} />
        <Route path="/hr/contracts" element={<ContractsPage />} />
        <Route path="/hr/rewards" element={<RewardsPage />} />
        <Route path="/hr/reports" element={<ReportsPage />} />
      </Route>

      {/* MANAGER */}
      <Route element={<ProtectedRoute role="manager" />}>
        <Route path="/manager/dashboard" element={<DashboardMNPage />} />
        <Route path="/manager/employees" element={<EmployeesMNPage />} />
        {<Route path="/manager/departments" element={<DepartmentsMNPage />} />}
        <Route path="/manager/attendance" element={<AttendanceMNPage />} />
        <Route path="/manager/leave" element={<LeaveMNPage />} />
        <Route path="/manager/salary" element={<SalaryMNPage />} />
        {<Route path="/manager/rewards" element={<RewardsMNPage />} />}
      </Route>

      {/* EMPLOYEE */}
      <Route element={<ProtectedRoute role="employee" />}>
        <Route path="/employee" element={<ProfilePage />} />
        <Route path="/employee/attendance" element={<MyAttendancePage />} />
        <Route path="/employee/salary" element={<MySalaryPage />} />
        <Route path="/employee/leave" element={<MyLeavePage />} />
        <Route path="/employee/contract" element={<MyContractPage />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}