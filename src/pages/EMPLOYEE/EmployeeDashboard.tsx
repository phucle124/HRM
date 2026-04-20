import { Navigate } from 'react-router-dom';

// Legacy dashboard cũ. Giữ lại để tránh import lỗi, nhưng điều hướng sang màn hồ sơ mới.
export default function EmployeeDashboard() {
  return <Navigate to="/employee" replace />;
}
