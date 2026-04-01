import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (username === 'admin' && password === '123456') {
      login({
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin',
      });
      navigate('/admin/dashboard');
      return;
    }

    if (username === 'hr' && password === '123456') {
      login({
        name: 'HR',
        email: 'hr@gmail.com',
        role: 'hr',
      });
      navigate('/hr');
      return;
    }

    if (username === 'manager' && password === '123456') {
      login({
        name: 'Manager',
        email: 'manager@gmail.com',
        role: 'manager',
      });
      navigate('/manager/dashboard');
      return;
    }

    if (username === 'employee' && password === '123456') {
      login({
        name: 'Employee',
        email: 'employee@gmail.com',
        role: 'employee',
      });
      navigate('/employee');
      return;
    }

    setError('Sai tên đăng nhập hoặc mật khẩu');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f1] px-4">
      <div className="w-full max-w-lg bg-white rounded-[30px] shadow-xl p-10 border border-gray-200">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng nhập hệ thống
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Truy cập hệ thống quản lý nhân sự theo đúng vai trò
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-2xl mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f7f2ec] p-5 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-2">
            Tài khoản dùng thử
          </p>
          <p>Admin: admin / 123456</p>
          <p>HR: hr / 123456</p>
          <p>Manager: manager / 123456</p>
          <p>Employee: employee / 123456</p>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Liên hệ bộ phận HR nếu cần hỗ trợ tài khoản
        </p>
      </div>
    </div>
  );
}