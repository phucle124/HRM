import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';

// Nếu đang test local thì dùng localhost, nếu đã deploy thì đổi thành URL thật

const BASE_URL = 'https://hrm-phkz.onrender.com';

const SalaryMNPage: React.FC = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalaries = async () => {
      // Nếu chưa có thông tin user, không gọi API
      if (!user?.id) return; 

      try {
        setLoading(true);
        // Gọi API với ID của Manager đang đăng nhập
        const response = await fetch(`${BASE_URL}/employee/salary/${user.id}`, {
          method: 'GET',
          credentials: 'include', // Giữ nguyên cấu hình session cookie
        });

        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu lương từ máy chủ');
        }

        const result = await response.json();
        
        // Đảm bảo dữ liệu set vào state luôn là một mảng để hàm .map() không bị crash
        const data = result.data || result;
        if (Array.isArray(data)) {
          setSalaries(data);
        } else if (data) {
          setSalaries([data]); // Nếu API trả về 1 object, bọc nó vào mảng
        } else {
          setSalaries([]);
        }
        
      } catch (err) {
        console.error('Fetch Salary Error:', err);
        setError('Không thể lấy dữ liệu lương. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [user]);

  // Giao diện khi đang tải dữ liệu (tránh trắng trang)
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <p className="text-gray-500 font-medium animate-pulse">Đang tải bảng lương...</p>
      </div>
    );
  }

  // Giao diện khi có lỗi
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Bảng lương phòng {user?.departmentName || 'của bạn'}
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {salaries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có dữ liệu lương.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">Nhân viên</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Tháng</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Lương cơ bản</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Tổng lương</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Trạng thái</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {salaries.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">
                      {item.employeeName || user?.name}
                    </td>
                    <td className="p-4 text-gray-600">{item.month || 'N/A'}</td>
                    <td className="p-4 text-gray-600">
                      {item.basicSalary ? item.basicSalary.toLocaleString() : 0} đ
                    </td>
                    <td className="p-4 text-brand-deep font-bold">
                      {item.total ? item.total.toLocaleString() : 0} đ
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'Đã thanh toán' 
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' 
                          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                      }`}>
                        {item.status || 'Chờ duyệt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryMNPage;