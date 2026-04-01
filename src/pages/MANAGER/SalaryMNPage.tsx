import React from 'react';
import { salaryRecords, employees } from '../../data/mockData';

const SalaryMNPage: React.FC = () => {
  const managerDepartment = 'Nhân sự';
  const managerName = 'Nguyễn Hoàng Minh';

  const departmentEmployees = employees.filter(
    (emp) => emp.department === managerDepartment
  );

  const departmentSalaries = salaryRecords.filter(
    (salary) =>
      salary.employeeName === managerName ||
      departmentEmployees.some((emp) => emp.id === salary.employeeId)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Bảng lương phòng {managerDepartment}
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nhân viên</th>
              <th className="p-4 text-left">Tháng</th>
              <th className="p-4 text-left">Lương cơ bản</th>
              <th className="p-4 text-left">Tổng lương</th>
              <th className="p-4 text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {departmentSalaries.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{item.employeeName}</td>
                <td className="p-4">{item.month}</td>
                <td className="p-4">
                  {item.basicSalary.toLocaleString()} đ
                </td>
                <td className="p-4">
                  {item.total.toLocaleString()} đ
                </td>
                <td className="p-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryMNPage;