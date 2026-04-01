import React from 'react';
import { rewardRecords, employees } from '../../data/mockData';

const RewardsMNPage = () => {
  const managerDepartment = 'Nhân sự';

  const departmentEmployees = employees.filter(
    (emp) => emp.department === managerDepartment
  );

  const departmentRewards = rewardRecords.filter((reward) =>
    departmentEmployees.some((emp) => emp.fullName === reward.employeeName)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Khen thưởng / Kỷ luật phòng {managerDepartment}
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nhân viên</th>
              <th className="p-4 text-left">Loại</th>
              <th className="p-4 text-left">Nội dung</th>
              <th className="p-4 text-left">Ngày</th>
              <th className="p-4 text-left">Số tiền</th>
            </tr>
          </thead>

          <tbody>
            {departmentRewards.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{item.employeeName}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">{item.title}</td>
                <td className="p-4">{item.date}</td>
                <td className="p-4">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardsMNPage;