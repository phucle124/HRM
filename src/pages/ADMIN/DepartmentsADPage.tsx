import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface Department {
  id: number;
  name: string;
  managerId: number | null;
}

interface Employee {
  id: number;
  name: string;
}

export default function DepartmentsADPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: '', manager_id: '' });

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/departments`, {
        headers: { Authorization: `Bearer ${user?.token || ''}` },
      });
      const result = await res.json();
      const formatted = (result.data || []).map((d: any) => ({
        id: d.department_id,
        name: d.name,
        managerId: d.manager_id,
      }));
      setDepartments(formatted);
    } catch (err) {
      console.error('Lỗi tải phòng ban:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for manager select
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${user?.token || ''}` },
      });
      const result = await res.json();
      setEmployees(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Lỗi tải nhân viên:', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [user]);

  const openModal = (dept: Department | null = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({ name: dept.name, manager_id: dept.managerId?.toString() || '' });
    } else {
      setEditingDept(null);
      setFormData({ name: '', manager_id: '' });
    }
    setShowModal(true);
  };

  const saveDepartment = async () => {
    if (!user?.token) return alert('Hết phiên làm việc!');
    try {
      const url = editingDept ? `${BASE_URL}/departments/${editingDept.id}` : `${BASE_URL}/departments`;
      const method = editingDept ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
          name: formData.name,
          manager_id: formData.manager_id ? Number(formData.manager_id) : null,
        }),
      });
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối!');
    }
  };

  const deleteDepartment = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa phòng ban này?')) return;
    try {
      await fetch(`${BASE_URL}/departments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token || ''}` },
      });
      fetchDepartments();
    } catch (err) {
      console.error(err);
      alert('Lỗi xóa phòng ban!');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Cơ cấu tổ chức</h1>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition"
        >
          + Thêm phòng ban mới
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-4">{dept.name}</h3>
              <p className="text-gray-500 text-sm">Manager ID: {dept.managerId || 'Chưa gán'}</p>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                <button onClick={() => openModal(dept)} className="text-blue-600 font-medium">Sửa</button>
                <button onClick={() => deleteDepartment(dept.id)} className="text-red-500 font-medium">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingDept ? 'Cập nhật' : 'Thêm'} phòng ban</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên phòng ban"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <select 
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.manager_id}
                onChange={e => setFormData({...formData, manager_id: e.target.value})}
              >
                <option value="">-- Chọn Trưởng Phòng --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} (ID: {emp.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium">Hủy</button>
              <button onClick={saveDepartment} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                Lưu dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}