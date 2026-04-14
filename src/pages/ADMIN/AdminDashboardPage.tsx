import React from 'react';
import { useAuth } from '../../context/authContext';
// Thêm useAppData để lấy dữ liệu tổng hệ thống
import { useAppData } from '../../context/dataContext'; 
import { PageTitle, Card, KeyValueGrid, AvatarBadge, StatusBadge, SummaryCard } from '../../components/ui';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  // Lấy danh sách departments từ Context đã gọi API ở file dataContext
  const { departments } = useAppData(); 

  const getInitials = (name: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const profileInfo = [
    { label: 'Mã tài khoản', value: user?.id ? `#${user.id}` : 'N/A' },
    { label: 'Họ và tên', value: user?.name || 'Chưa cập nhật' },
    { label: 'Email', value: user?.email || 'Chưa cập nhật email' },
    { label: 'Phân quyền', value: user?.role === 'admin' ? 'Quản trị viên (Admin)' : (user?.role || 'N/A') },
    { label: 'Phòng ban', value: user?.departmentName || 'Ban Giám Đốc / Hệ thống' },
  ];

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Admin Dashboard" 
        subtitle={`Chào mừng quay trở lại, ${user?.name}`} 
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Hồ sơ cá nhân">
            <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <AvatarBadge initials={getInitials(user?.name || '')} size="xl" />
              <div>
                <h2 className="text-2xl font-bold text-stone-900">{user?.name}</h2>
                <p className="mb-3 text-stone-500">{user?.email}</p>
                <StatusBadge status="Đang làm" />
              </div>
            </div>
            <KeyValueGrid items={profileInfo} />
          </Card>
        </div>

        <div className="space-y-6">
          {/* SỬ DỤNG DỮ LIỆU THẬT TỪ API Ở ĐÂY */}
          <SummaryCard 
            label="Tổng phòng ban" 
            value={departments.length.toString()} 
            change="Dữ liệu toàn hệ thống" 
            accent="bg-brand-soft"
          />
          
          {/* TẠM THỜI CODE CỨNG VÌ BACKEND CHƯA CÓ API LẤY DANH SÁCH NGHỈ PHÉP */}
          <SummaryCard 
            label="Đơn nghỉ phép" 
            value="0" 
            change="Cần bổ sung API backend" 
            accent="bg-[#f6efe7]"
          />
        </div>
      </div>
    </div>
  );
}