import React from 'react';
import { useAuth } from '../../context/authContext';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Chào mừng quay trở lại, <span className="font-semibold">{user?.name}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Phòng ban</p>
          <p className="text-5xl font-bold mt-3">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Đơn nghỉ phép chờ duyệt</p>
          <p className="text-5xl font-bold mt-3 text-orange-600">17</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;