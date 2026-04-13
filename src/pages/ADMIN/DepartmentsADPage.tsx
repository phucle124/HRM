import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';

axios.defaults.withCredentials = true;
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

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/departments`, {
        method: 'GET',
        credentials: 'include', // Gửi kèm Cookie
      });
      const result = await res.json();
      
      const dataList = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
      
      const formatted = dataList.map((d: any) => ({
        id: d.department_id || d.id,
        name: d.name,
        managerId: d.manager_id || d.managerId || null,
      }));
      setDepartments(formatted);
    } catch (err) {
      console.error('Lỗi tải phòng ban:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BASE_URL}/employees`, {
        method: 'GET',
        credentials: 'include', // Gửi kèm Cookie
      });
      const result = await res.json();
      
      const dataList = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
      setEmployees(dataList);
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
    console.log(user);
    
    // Chỉ kiểm tra user, không kiểm tra token nữa
    if (!user) return alert('Hết phiên làm việc, vui lòng đăng nhập lại!');
    
    // try {
      const deptId = editingDept?.id;
      if (editingDept && !deptId) {
        return alert("Lỗi dữ liệu: Không tìm thấy ID phòng ban để cập nhật.");
      }

      const url = editingDept ? `${BASE_URL}/departments/${deptId}` : `${BASE_URL}/departments`;
      const method = editingDept ? 'PUT' : 'POST';

      console.log('method =>', method);
      console.log('url1231231 =>', url);
      

      const response = await fetch(url, {
        method,
        credentials: 'include', // Gửi kèm Cookie
        headers: { 
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          name: formData.name,
          manager_id: formData.manager_id ? Number(formData.manager_id) : null,
          managerId: formData.manager_id ? Number(formData.manager_id) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lưu thất bại');
      }

      console.log(response);
      

      alert('Cập nhật thành công!');
      setShowModal(false);
      fetchDepartments(); // Gọi lại hàm để cập nhật danh sách

    // } catch (err: any) {
    //   console.error('Lỗi khi lưu:', err);
    //   alert('Lỗi: ' + err.message);
    // }
  };

  const deleteDepartment = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa phòng ban này? Hành động này không thể hoàn tác.')) return;
    try {
      const res = await fetch(`${BASE_URL}/departments/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Gửi kèm Cookie
      });
      if (!res.ok) throw new Error('Lỗi từ server');
      
      fetchDepartments();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa phòng ban!');
    }
  };

  const getManagerName = (managerId: number | null) => {
    if (!managerId) return <span className="text-gray-400 italic">Chưa gán</span>;
    const manager = employees.find(emp => emp.id === managerId);
    return manager ? (
      <span className="text-blue-600 font-medium">{manager.name}</span>
    ) : (
      <span className="text-gray-500">ID: {managerId} (Không tìm thấy)</span>
    );
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
        <p className="text-gray-500 text-center py-10 animate-pulse">Đang tải dữ liệu phòng ban...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="font-bold text-xl text-gray-800 mb-4">{dept.name}</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500 text-sm w-24">Trưởng phòng:</span>
                <span className="text-sm">{getManagerName(dept.managerId)}</span>
              </div>
              
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-50">
                <button onClick={() => openModal(dept)} className="text-blue-600 text-sm font-medium hover:underline">
                  Chỉnh sửa
                </button>
                <button onClick={() => deleteDepartment(dept.id)} className="text-red-500 text-sm font-medium hover:underline">
                  Xóa
                </button>
              </div>
            </div>
          ))}
          {departments.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              Chưa có phòng ban nào trong hệ thống.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingDept ? 'Cập nhật' : 'Thêm'} phòng ban</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng ban <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Nhập tên phòng ban..."
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trưởng phòng (Manager)</label>
                <select 
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  value={formData.manager_id}
                  onChange={e => setFormData({...formData, manager_id: e.target.value})}
                >
                  <option value="">-- Để trống nếu chưa có --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} (ID: {emp.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                Hủy
              </button>
              <button onClick={saveDepartment} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Lưu dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}