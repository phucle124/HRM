import React, { useMemo, useState } from 'react';
import { useAppData } from '../../context/dataContext';
import type { Employee } from '../../types/hrm';

export default function EmployeesADPage() {
  const { employees } = useAppData();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
        emp.code.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        departmentFilter === '' || emp.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  return (
    <div className="flex gap-6">
      {/* LEFT TABLE */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã"
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">Tất cả phòng ban</option>
            {[...new Set(employees.map((e) => e.department))].map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Thêm
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-center text-gray-600 text-sm">
                <th className="px-4 py-3 font-medium">Mã NV</th>
                <th className="px-4 py-3 font-medium">Họ tên</th>
                <th className="px-4 py-3 font-medium">Phòng ban</th>
                <th className="px-4 py-3 font-medium">Chức vụ</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium w-[160px]">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="text-center border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{emp.code}</td>

                  <td
                    className="px-4 py-3 text-blue-600 cursor-pointer font-medium"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    {emp.fullName}
                  </td>

                  <td className="px-4 py-3">{emp.department}</td>
                  <td className="px-4 py-3">{emp.position}</td>
                  <td className="px-4 py-3">{emp.status}</td>

                  <td className="px-4 py-3 w-[160px]">
                    <div className="flex justify-center gap-3">
                      <button className="text-blue-600 hover:underline">Sửa</button>
                      <button className="text-red-500 hover:underline">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT DETAIL PANEL */}
      {selectedEmployee && (
        <div className="w-80 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Chi tiết nhân viên</h2>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Họ tên:</strong> {selectedEmployee.fullName}
            </p>
            <p>
              <strong>Mã NV:</strong> {selectedEmployee.code}
            </p>
            <p>
              <strong>Phòng ban:</strong> {selectedEmployee.department}
            </p>
            <p>
              <strong>Chức vụ:</strong> {selectedEmployee.position}
            </p>
            <p>
              <strong>Email:</strong> {selectedEmployee.email}
            </p>
            <p>
              <strong>SĐT:</strong> {selectedEmployee.phone}
            </p>
            <p>
              <strong>Ngày vào làm:</strong> {selectedEmployee.joinDate}
            </p>
            <p>
              <strong>Địa điểm:</strong> {selectedEmployee.location}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedEmployee.status}
            </p>
          </div>

          <button
            className="mt-4 text-red-500"
            onClick={() => setSelectedEmployee(null)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}