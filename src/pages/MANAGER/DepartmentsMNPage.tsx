import React from 'react';
import { departments } from '../../data/mockData';

const DepartmentMNPage = () => {
  const managerDepartment = 'Nhân sự';

  const myDepartment = departments.filter(
    (dept) => dept.name === managerDepartment
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Phòng ban của tôi</h1>

      {myDepartment.map((dept) => (
        <div
          key={dept.id}
          className="bg-white p-6 rounded-xl shadow border"
        >
          <h2 className="text-xl font-bold mb-2">{dept.name}</h2>
          <p>Trưởng phòng: {dept.manager}</p>
          <p>Số nhân viên: {dept.totalEmployees}</p>
          <p>Vị trí tuyển: {dept.openPositions}</p>
          <p>Ngân sách: {dept.budget}</p>
        </div>
      ))}
    </div>
  );
};

export default DepartmentMNPage;