import React, { useMemo, useState } from 'react';
import { useAppData } from '../../context/dataContext';

export default function DepartmentsPage() {
  const { departments, employees, addDepartment } = useAppData();

  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [newDept, setNewDept] = useState({
    name: '',
    manager: '',
  });

  const departmentEmployees = useMemo(() => {
    if (!selectedDept) return [];
    return employees.filter((emp) => emp.department === selectedDept);
  }, [employees, selectedDept]);

  const handleAddDepartment = () => {
    if (!newDept.name) return;

    addDepartment({
      name: newDept.name,
      manager: newDept.manager,
      totalEmployees: 0,
      openPositions: 0,
      budget: '0',
    });

    setNewDept({ name: '', manager: '' });
    setShowModal(false);
  };

  return (
    <div className="flex gap-6">
      {/* LEFT */}
      <div className="flex-1">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Quản lý phòng ban</h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-xl"
          >
            + Tạo phòng ban
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedDept(dept.name)}
            >
              <h3 className="text-lg font-semibold">{dept.name}</h3>

              <p className="text-sm text-gray-500 mt-2">
                Trưởng phòng: {dept.manager || 'Chưa có'}
              </p>

              <p className="text-3xl font-bold mt-4">
                {employees.filter((e) => e.department === dept.name).length}
              </p>

              <p className="text-sm text-gray-500">nhân viên</p>

              <div className="mt-4 flex gap-4">
                <button className="text-blue-600">Sửa</button>
                <button className="text-red-500">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT DETAIL */}
      {selectedDept && (
        <div className="w-96 bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4">
            Nhân viên phòng {selectedDept}
          </h2>

          <div className="space-y-3">
            {departmentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="border-b pb-2 flex justify-between text-sm"
              >
                <span>{emp.fullName}</span>
                <span className="text-gray-500">{emp.position}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedDept(null)}
            className="mt-4 text-red-500"
          >
            Đóng
          </button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h2 className="text-xl font-semibold mb-5">Tạo phòng ban mới</h2>

            <input
              type="text"
              placeholder="Tên phòng ban"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              value={newDept.name}
              onChange={(e) =>
                setNewDept({ ...newDept, name: e.target.value })
              }
            />

            <select
              className="w-full border rounded-lg px-3 py-2 mb-5"
              value={newDept.manager}
              onChange={(e) =>
                setNewDept({ ...newDept, manager: e.target.value })
              }
            >
              <option value="">Chọn trưởng phòng</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.fullName}>
                  {emp.fullName}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                Hủy
              </button>

              <button
                onClick={handleAddDepartment}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}