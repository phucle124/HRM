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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Bật tính năng nhận Cookie từ Server
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Dữ liệu User từ Server:", data.data); // Chụp dòng này cho BE xem
      
      if (!response.ok) {
        setError(data.message || 'Sai tài khoản hoặc mật khẩu');
        setLoading(false);
        return;
      }

      // 1. Khởi tạo object user cơ bản từ dữ liệu Session BE trả về
      const nextUser: any = {
        id: data.data.id,
        name: data.data.name,
        email: username,
        role: data.data.role, // FE CHỈ ĐỌC ROLE TỪ SESSION BE TRẢ VỀ
      };

      // 2. Tự động map Profile / Employee ID (RẤT QUAN TRỌNG ĐỂ KHÔNG BỊ LỖI TRẮNG HỒ SƠ)
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

      // 3. ÉP KIỂU (HARDCODE) QUYỀN MANAGER ĐỂ TEST UI
      // Thêm cả email thật của bạn vào để test cho chắc chắn
      //if (username === 'abc@gmail.com' || username === 'dh52201235@student.stu.edu.vn' || nextUser.name === 'Lê Anh Đức') {
       // nextUser.role = 'manager';
       // console.log(`🔥 Đã ép quyền Manager thành công cho tài khoản: ${username} để test UI!`);
      //}

      // 4. Lưu toàn bộ thông tin vào Context
      login(nextUser);

      // 5. Điều hướng theo Role (Chỉ để 1 lần ở cuối cùng)
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
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Đăng nhập bằng tài khoản có trong database
        </p>
      </div>
    </div>
  );
}