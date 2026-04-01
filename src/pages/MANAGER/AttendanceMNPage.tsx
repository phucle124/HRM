import React from 'react';
import { attendanceRecords, employees } from '../../data/mockData';

const AttendanceMNPage: React.FC = () => {
  const managerDepartment = 'Nhân sự';

  const departmentEmployees = employees.filter(
    (emp) => emp.department === managerDepartment
  );

  const departmentAttendance = attendanceRecords.filter((record) =>
    departmentEmployees.some((emp) => emp.id === record.employeeId)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Chấm công phòng {managerDepartment}
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nhân viên</th>
              <th className="p-4 text-left">Ngày</th>
              <th className="p-4 text-left">Check In</th>
              <th className="p-4 text-left">Check Out</th>
              <th className="p-4 text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {departmentAttendance.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.employeeName}</td>
                <td className="p-4">{item.date}</td>
                <td className="p-4">{item.checkIn}</td>
                <td className="p-4">{item.checkOut}</td>
                <td className="p-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceMNPage;