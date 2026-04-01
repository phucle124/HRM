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
          <p className="text-gray-500">Tổng nhân viên</p>
          <p className="text-5xl font-bold mt-3">248</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Phòng ban</p>
          <p className="text-5xl font-bold mt-3">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Đơn nghỉ phép chờ duyệt</p>
          <p className="text-5xl font-bold mt-3 text-orange-600">17</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Tổng lương tháng này</p>
          <p className="text-5xl font-bold mt-3">1.425.000.000 ₫</p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-semibold mb-6">Chức năng nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 bg-blue-50 hover:bg-blue-100 rounded-xl text-left transition">
            <p className="font-medium">Quản lý Nhân viên</p>
          </button>
          <button className="p-6 bg-green-50 hover:bg-green-100 rounded-xl text-left transition">
            <p className="font-medium">Quản lý Phòng ban</p>
          </button>
          <button className="p-6 bg-purple-50 hover:bg-purple-100 rounded-xl text-left transition">
            <p className="font-medium">Duyệt Nghỉ phép</p>
          </button>
          <button className="p-6 bg-amber-50 hover:bg-amber-100 rounded-xl text-left transition">
            <p className="font-medium">Tính lương tháng</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;