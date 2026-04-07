import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';

interface Employee {
  employee_id: number;
  full_name: string;
  department_name: string;
  position: string;
}

const EmployeesMNPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8888/manager/staff-list/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((err) => {
        console.error('Lỗi load nhân viên:', err);
      });
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Danh sách nhân viên phòng ban 👨‍💼
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Mã NV</th>
              <th className="p-4 text-left">Tên</th>
              <th className="p-4 text-left">Phòng ban</th>
              <th className="p-4 text-left">Chức vụ</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employee_id} className="border-b hover:bg-gray-50">
                <td className="p-4">{emp.employee_id}</td>
                <td className="p-4">{emp.full_name}</td>
                <td className="p-4">{emp.department_name}</td>
                <td className="p-4">{emp.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesMNPage;