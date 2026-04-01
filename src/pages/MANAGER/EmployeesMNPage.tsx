import React from 'react';
import { employees } from '../../data/mockData';

const EmployeesMNPage: React.FC = () => {
  const managerDepartment = 'Nhân sự';

  const departmentEmployees = employees.filter(
    (emp) => emp.department === managerDepartment
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Nhân viên phòng {managerDepartment}
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
            {departmentEmployees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{emp.code}</td>
                <td className="p-4">{emp.fullName}</td>
                <td className="p-4">{emp.department}</td>
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