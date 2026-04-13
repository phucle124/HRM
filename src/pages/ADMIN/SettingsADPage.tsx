import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';

axios.defaults.withCredentials = true;
const BASE_URL = 'https://hrm-phkz.onrender.com';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_lock: number;
}

export default function SettingsADPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: '' });
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm tạo cấu hình cho axios - Sử dụng Cookie
  const getHeaders = useCallback(() => ({
    headers: { 
      'Content-Type': 'application/json' 
    },
    withCredentials: true // Chìa khóa vàng để gửi Cookie
  }), []);

  const fetchUsers = async () => {
    // ĐÃ SỬA: Chỉ cần kiểm tra có user (đã đăng nhập) là đủ
    if (!user) return; 
    
    setLoading(true);
    try {
      // Axios sẽ tự động mang theo Cookie nhờ withCredentials trong getHeaders
      const res = await axios.get(`${BASE_URL}/users`, getHeaders());
      const dataList = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
      setUsers(dataList);
    } catch (err) {
      console.error('Lỗi tải danh sách:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // ĐÃ SỬA: Theo dõi biến user thay vì user.token
  }, [user]);

  const saveUser = async () => {
    setErrorMessage('');
    
    // ĐÃ SỬA: Chỉ cần kiểm tra user
    if (!user) {
      return alert('Hết phiên làm việc, vui lòng đăng nhập lại!');
    }

    const config = getHeaders();
    const dataToSend = { ...formData };
    
    // Xử lý logic mật khẩu: Khi sửa, nếu để trống thì không gửi password lên
    if (editingUser && !dataToSend.password) {
      delete (dataToSend as any).password;
    }

    try {
      if (editingUser) {
        await axios.put(`${BASE_URL}/users/${editingUser.id}`, dataToSend, config);
        alert('Cập nhật thành công!');
      } else {
        if (!dataToSend.password) return alert('Vui lòng nhập mật khẩu cho user mới!');
        await axios.post(`${BASE_URL}/users`, dataToSend, config);
        alert('Tạo user thành công!');
      }
      setShowModal(false);
      fetchUsers(); 
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Lỗi lưu dữ liệu!');
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Bạn có muốn xóa user này?')) return;
    
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, getHeaders());
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi xóa user!');
    }
  };

  const toggleLock = async (u: User) => {
    try {
      await axios.patch(`${BASE_URL}/users/${u.id}/lock`, { isLock: u.is_lock ? 0 : 1 }, getHeaders());
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi thay đổi trạng thái!');
    }
  };

  const openModal = (u: User | null = null) => {
    setErrorMessage('');
    if (u) {
      setEditingUser(u);
      setFormData({ name: u.name, email: u.email, password: '', phone: u.phone || '', role: u.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', phone: '', role: '' });
    }
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý User Hệ thống</h1>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition"
        >
          + Thêm user mới
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-10 animate-pulse">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(u => (
            <div key={u.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative">
              <div className="absolute top-6 right-6">
                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.is_lock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {u.is_lock ? 'Locked' : 'Active'}
                 </span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 pr-20">{u.name}</h3>
              <div className="space-y-1 mb-6 text-sm text-gray-600">
                <p>Email: {u.email}</p>
                <p>Phone: {u.phone || 'Chưa có'}</p>
                <p>Role: <span className="uppercase font-bold text-blue-600">{u.role}</span></p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button onClick={() => toggleLock(u)} className="text-orange-500 text-xs font-bold hover:underline uppercase">
                  {u.is_lock ? 'Mở khóa' : 'Khóa'}
                </button>
                <button onClick={() => openModal(u)} className="text-blue-600 text-xs font-bold hover:underline uppercase">Sửa</button>
                <button onClick={() => deleteUser(u.id)} className="text-red-500 text-xs font-bold hover:underline uppercase">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{editingUser ? 'Cập nhật' : 'Thêm mới'} Tài khoản</h2>
            {errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-100">{errorMessage}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="Họ và Tên" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email đăng nhập" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Mật khẩu (để trống nếu không đổi)" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <input type="tel" placeholder="Số điện thoại" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <select className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="">-- Chọn Vai trò --</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50 transition">Hủy</button>
              <button onClick={saveUser} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200">Lưu dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}