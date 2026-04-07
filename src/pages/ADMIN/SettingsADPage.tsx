import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';


const BASE_URL = 'http://localhost:8888/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_lock: number;
}

export default function UsersADPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: '' });

  const config = {
    headers: { Authorization: `Bearer ${user?.token || ''}`, 'Content-Type': 'application/json' },
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users`, config);
      setUsers(res.data || []);
    } catch (err) {
      console.error('Lỗi tải user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const openModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', phone: user.phone || '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', phone: '', role: '' });
    }
    setShowModal(true);
  };

  const saveUser = async () => {
    try {
      if (editingUser) {
        await axios.put(`${BASE_URL}/users/${editingUser.id}`, formData, config);
      } else {
        await axios.post(`${BASE_URL}/users`, formData, config);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Lỗi lưu dữ liệu!');
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, config);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Lỗi xóa user!');
    }
  };

  const toggleLock = async (user: User) => {
    try {
      await axios.patch(`${BASE_URL}/users/${user.id}/lock`, { isLock: user.is_lock ? 0 : 1 }, config);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Lỗi thay đổi trạng thái!');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý User</h1>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition"
        >
          + Thêm user mới
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-2">{user.name}</h3>
              <p className="text-gray-500 text-sm">Email: {user.email}</p>
              <p className="text-gray-500 text-sm">Role: {user.role}</p>
              <p className="text-gray-500 text-sm">Status: {user.is_lock ? 'Locked' : 'Active'}</p>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                <button onClick={() => openModal(user)} className="text-blue-600 font-medium">Sửa</button>
                <button onClick={() => deleteUser(user.id)} className="text-red-500 font-medium">Xóa</button>
                <button onClick={() => toggleLock(user)} className="text-yellow-600 font-medium">
                  {user.is_lock ? 'Unlock' : 'Lock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingUser ? 'Cập nhật' : 'Thêm'} User</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <select 
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="">-- Chọn Role --</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium">Hủy</button>
              <button onClick={saveUser} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                Lưu dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}