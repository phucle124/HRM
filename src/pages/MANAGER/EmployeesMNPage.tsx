import React, { useState, useEffect, useMemo } from 'react';
import { useAppData } from '../../context/dataContext';

export default function EmployeesADPage() {
  // Lấy dữ liệu users từ context (Admin quản lý Users)
  // Lưu ý: Nếu Backend gọi là employees thì bạn đổi thành lấy từ employees nhé
  const { users, fetchUsers } = useAppData(); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Tất cả phòng ban');

  // Gọi API tải dữ liệu khi vừa vào trang
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Tự động lấy ra danh sách các phòng ban (không trùng lặp) để hiển thị trong Dropdown
  const departmentOptions = useMemo(() => {
    const depts = users
      .map((u) => u.department_name)
      .filter((name) => name); // Loại bỏ các giá trị rỗng/null
    return ['Tất cả phòng ban', ...new Set(depts)];
  }, [users]);

  // Logic Lọc (Filter) và Tìm kiếm (Search)
  const filteredData = useMemo(() => {
    return users.filter((user) => {
      // Tìm theo tên
      const matchName = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
      // Lọc theo phòng ban
      const matchDept = filterDept === 'Tất cả phòng ban' || user.department_name === filterDept;
      
      return matchName && matchDept;
    });
  }, [users, searchTerm, filterDept]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-5xl">
        
        {/* THANH TÌM KIẾM VÀ LỌC */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 w-full sm:w-64 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition bg-white text-gray-700"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departmentOptions.map((dept, idx) => (
              <option key={idx} value={dept as string}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 w-20">ID</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700">Họ tên</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700">Phòng ban</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, idx) => (
                <tr 
                  key={user.id || idx} 
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Cột ID */}
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    #{user.id}
                  </td>
                  
                  {/* Cột Họ Tên (Màu xanh, có thể click) */}
                  <td className="py-4 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                    {user.name}
                  </td>
                  
                  {/* Cột Phòng ban (Badge xám) */}
                  <td className="py-4 px-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
                      {user.department_name || 'Chưa xếp'}
                    </span>
                  </td>
                  
                  {/* Cột Email (In nghiêng) */}
                  <td className="py-4 px-4 text-gray-500 italic text-sm">
                    {user.email || 'Chưa cập nhật'}
                  </td>
                </tr>
              ))}

              {/* Trạng thái trống */}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500">
                    Không tìm thấy dữ liệu phù hợp với tìm kiếm của bạn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}