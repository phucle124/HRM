import React from 'react';
import {
  employees,
  leaveRecords,
  attendanceRecords,
} from '../../data/mockData';

const DashboardMNPage: React.FC = () => {
  const managerDepartment = 'Nhân sự';

  const departmentEmployees = employees.filter(
    (emp) => emp.department === managerDepartment
  );

  const pendingLeaves = leaveRecords.filter((leave) =>
    departmentEmployees.some(
      (emp) =>
        emp.id === leave.employeeId && leave.status === 'Chờ duyệt'
    )
  );

  const todayAttendance = attendanceRecords.filter((record) =>
    departmentEmployees.some((emp) => emp.id === record.employeeId)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard Manager
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg text-gray-500 mb-2">
            Nhân viên nhóm quản lý
          </h2>
          <p className="text-3xl font-bold">
            {departmentEmployees.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg text-gray-500 mb-2">
            Nghỉ phép chờ duyệt
          </h2>
          <p className="text-3xl font-bold">
            {pendingLeaves.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg text-gray-500 mb-2">
            Chấm công hôm nay
          </h2>
          <p className="text-3xl font-bold">
            {todayAttendance.length}
          </p>
        </div>

      </div>
    </div>
  );
};

export default DashboardMNPage;