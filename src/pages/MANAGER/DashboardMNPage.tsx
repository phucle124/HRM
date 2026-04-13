import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext'; // Import hook thần thánh của chúng ta

// Nhớ đổi thành URL Backend thật của bạn khi đẩy lên Render nhé
const BASE_URL = 'https://hrm-phkz.onrender.com'; 

export default function ProfilePage() {
  // 1. Gọi useAuth để lấy thông tin người đang đăng nhập
  const { user } = useAuth(); 
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nếu chưa đăng nhập (hoặc đang load cookie) thì đứng im
    if (!user) return;

    const fetchMyProfile = async () => {
      setLoading(true);
      try {
        // 2. Thay số 4 cứng nhắc bằng biến user.id linh hoạt
        // Ví dụ: user.id là 10 => Link sẽ tự động thành .../profile/10
        const res = await fetch(`${BASE_URL}/api/employee/profile/${user.id}`, {
          method: 'GET',
          credentials: 'include', // LUÔN LUÔN CÓ DÒNG NÀY ĐỂ TRÁNH LỖI 401
        });

        if (!res.ok) throw new Error('Không thể tải hồ sơ');

        const data = await res.json();
        // Set dữ liệu profile (Tùy theo Backend của bạn trả về data bọc trong object hay không)
        setProfile(data.data || data); 

      } catch (err) {
        console.error('Lỗi khi lấy hồ sơ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, [user]); // Mảng dependency có chữ 'user', nghĩa là hễ user xuất hiện là nó gọi API ngay

  // 3. Render giao diện
  if (loading) return <p className="p-6 text-gray-500 animate-pulse">Đang tải hồ sơ...</p>;
  if (!profile) return <p className="p-6 text-red-500">Không tìm thấy thông tin nhân viên</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h1>
      
      {/* Ví dụ in dữ liệu ra */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p><strong>Họ và tên:</strong> {profile.full_name || profile.name}</p>
        <p><strong>Phòng ban:</strong> {profile.department_name}</p>
        <p><strong>Chức vụ:</strong> {profile.position}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        {/* ... Thêm các trường dữ liệu khác của bạn vào đây ... */}
      </div>
    </div>
  );
}