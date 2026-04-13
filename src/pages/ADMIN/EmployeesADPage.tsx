import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/authContext';

interface Employee {
  id: number;
  name: string;
  email: string;
  department_name: string;
  position?: string;
  phone?: string;
  status?: string;
}

const BASE_URL = 'https://hrm-phkz.onrender.com';

export default function EmployeesADPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load danh sách nhân viên
  useEffect(() => {
    // CHẶN: Nếu chưa có thông tin user (đang check session) thì không gọi API ngay
    if (!user) return;

    const fetchEmployees = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${BASE_URL}/employees`, {
          method: 'GET',
          // ĐÃ SỬA: Thêm credentials để trình duyệt tự mang Cookie đi
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
            // ĐÃ XOÁ: Không gửi Authorization Bearer nữa vì dùng Cookie rồi
          },
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error('Phiên đăng nhập hết hạn');
          throw new Error('Không thể kết nối đến máy chủ');
        }

        const result = await res.json();
        
        // Xử lý dữ liệu linh hoạt (đề phòng backend bọc trong .data hoặc trả về mảng trực tiếp)
        const dataList = Array.isArray(result) ? result : (result.data || []);
        setEmployees(dataList);

      } catch (err: any) {
        console.error('Lỗi load nhân viên:', err);
        setError(err.message || 'Không thể tải danh sách nhân viên lúc này.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]); // Chạy lại khi user thay đổi (đăng nhập xong)

  // Filter nhân viên theo search (tên) và department_name
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name?.toLowerCase().includes(search.toLowerCase());
      const matchesDepartment = departmentFilter === '' || emp.department_name === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  // Lấy ra danh sách các phòng ban không trùng lặp để làm bộ lọc
  const uniqueDepartments = useMemo(() => {
    return [...new Set(employees.map((e) => e.department_name).filter(Boolean))];
  }, [employees]);

  return (
    <div className="flex gap-6 p-4">
      {/* Danh sách nhân viên */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">Tất cả phòng ban</option>
            {uniqueDepartments.map((dep, idx) => (
              <option key={idx} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm border-b">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Họ tên</th>
                <th className="px-6 py-4 font-semibold">Phòng ban</th>
                <th className="px-6 py-4 font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Đang tải dữ liệu...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-red-500 font-medium">{error}</td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t border-gray-100 hover:bg-blue-50/50 transition cursor-pointer"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="px-6 py-4 text-gray-500">#{emp.id}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        {emp.department_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 italic">{emp.email || 'Chưa cập nhật'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Không tìm thấy nhân viên nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chi tiết nhân viên (Side Panel) */}
      {selectedEmployee && (
        <div className="w-80 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Thông tin chi tiết</h2>
            <button 
              className="text-gray-400 hover:text-gray-600 transition text-lg"
              onClick={() => setSelectedEmployee(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-gray-400 block">Họ và tên</label>
              <p className="text-base font-semibold text-gray-900">{selectedEmployee.name}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Phòng ban</label>
              <p className="text-base text-gray-900">{selectedEmployee.department_name}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Email hệ thống</label>
              <p className="text-base text-gray-900 truncate">{selectedEmployee.email || 'N/A'}</p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic">* Dữ liệu được lấy trực tiếp từ hệ thống HRM</p>
            </div>
          </div>
          
          <button
            className="mt-8 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium"
            onClick={() => setSelectedEmployee(null)}
          >
            Đóng bảng tin
          </button>
        </div>
      )}
    </div>
  );
}