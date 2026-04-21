import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { resolveEmployeeIdFromSources } from '../../lib/employeeUtils';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://hrm-phkz.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Để nhận và lưu Cookie từ Server
        body: JSON.stringify({ email: username, password: password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Sai tài khoản hoặc mật khẩu');
        setLoading(false);
        return;
      }

      // 1. Lấy thông tin user từ data.data
      const userData = data.data;

      // 2. Tạo object user và ưu tiên nhận diện Manager ngay lập tức
      // Dựa trên cột isManager mà BE mới bổ sung
      const nextUser: any = {
        id: userData.id,
        name: userData.name,
        email: username,
        // Nếu BE báo isManager=true, ép role sang 'manager' để App.tsx mở Route Manager
        role: userData.isManager ? 'manager' : (userData.role || 'employee'), 
        token: data.token || userData.token,
        isManager: !!userData.isManager
      };

      // 3. Tự động map Profile / Employee ID
      if (['employee', 'manager', 'hr'].includes(nextUser.role)) {
        try {
          const resolvedEmployeeId = await resolveEmployeeIdFromSources({
            userId: nextUser.id,
            email: username,
            name: nextUser.name,
          });

          if (resolvedEmployeeId) {
            nextUser.employeeId = resolvedEmployeeId;
            nextUser.profileUserId = resolvedEmployeeId;
          }
        } catch (err) {
          console.warn("Không thể tự động map profile ID", err);
        }
      }

      // 4. Lưu vào Context (Hàm login sẽ lưu tiếp vào LocalStorage cho bạn)
      login(nextUser);

      // 5. Điều hướng theo Role đã được cập nhật
      if (nextUser.role === 'admin') navigate('/admin/dashboard');
      else if (nextUser.role === 'hr') navigate('/hr');
      else if (nextUser.role === 'manager') navigate('/manager/dashboard'); 
      else navigate('/employee');

    } catch (err) {
      setError('Không kết nối được server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f1] px-4">
      <div className="w-full max-w-lg bg-white rounded-[30px] shadow-xl p-10 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đăng nhập hệ thống</h1>
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
              Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="nhanvien@congty.com"
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
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Đăng nhập bằng tài khoản có trong hệ thống HRM
        </p>
      </div>
    </div>
  );
}