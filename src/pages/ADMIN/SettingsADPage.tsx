import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';

interface EmployeeAccount {
  username: string;
  password: string;
}

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();

  const [systemName, setSystemName] = useState('HRM System');
  const [employeeAccounts, setEmployeeAccounts] = useState<EmployeeAccount[]>([
    { username: '', password: '' },
  ]);

  // Lưu cài đặt vào localStorage
  const handleSave = () => {
    const settings = {
      systemName,
      employeeAccounts: employeeAccounts.filter(
        (acc) => acc.username && acc.password
      ),
    };
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    alert('Lưu cài đặt thành công!');
  };

  // Thêm một tài khoản mới
  const addEmployeeAccount = () => {
    setEmployeeAccounts([...employeeAccounts, { username: '', password: '' }]);
  };

  // Xóa tài khoản
  const removeEmployeeAccount = (index: number) => {
    const updated = [...employeeAccounts];
    updated.splice(index, 1);
    setEmployeeAccounts(updated);
  };

  // Cập nhật tài khoản
  const updateEmployeeAccount = (
    index: number,
    field: 'username' | 'password',
    value: string
  ) => {
    const updated = [...employeeAccounts];
    updated[index][field] = value;
    setEmployeeAccounts(updated);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Cài đặt hệ thống & Tạo tài khoản nhân viên</h1>

      <div className="max-w-3xl bg-white rounded-2xl shadow p-8 space-y-8">
        {/* Cài đặt hệ thống */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin hệ thống</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Tên hệ thống</label>
              <input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Tạo tài khoản nhân viên */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tài khoản nhân viên</h2>
          <div className="space-y-4">
            {employeeAccounts.map((acc, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input
                  placeholder="Tên tài khoản"
                  value={acc.username}
                  onChange={(e) =>
                    updateEmployeeAccount(idx, 'username', e.target.value)
                  }
                  className="flex-1 border px-4 py-2 rounded-lg"
                />
                <input
                  placeholder="Mật khẩu"
                  type="password"
                  value={acc.password}
                  onChange={(e) =>
                    updateEmployeeAccount(idx, 'password', e.target.value)
                  }
                  className="flex-1 border px-4 py-2 rounded-lg"
                />
                {employeeAccounts.length > 1 && (
                  <button
                    onClick={() => removeEmployeeAccount(idx)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addEmployeeAccount}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Thêm tài khoản
            </button>
          </div>
        </div>

        {/* Lưu cài đặt */}
        <div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Lưu cài đặt
          </button>
        </div>

        {/* Đăng xuất */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-red-600">Đăng xuất</h2>
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
                logout();
              }
            }}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;