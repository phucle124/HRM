import React from 'react';
import { leaveRecords, employees } from '../../data/mockData';

const LeaveMNPage: React.FC = () => {
  const managerDepartment = 'Nhân sự';

  const departmentEmployees = employees.filter(
    (emp) => emp.department === managerDepartment
  );

  const departmentLeaves = leaveRecords.filter((leave) =>
    departmentEmployees.some((emp) => emp.id === leave.employeeId)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Duyệt nghỉ phép phòng {managerDepartment}
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nhân viên</th>
              <th className="p-4 text-left">Loại nghỉ</th>
              <th className="p-4 text-left">Từ ngày</th>
              <th className="p-4 text-left">Đến ngày</th>
              <th className="p-4 text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {departmentLeaves.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{item.employeeName}</td>
                <td className="p-4">{item.type}</td>
                <td className="p-4">{item.startDate}</td>
                <td className="p-4">{item.endDate}</td>
                <td className="p-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveMNPage;