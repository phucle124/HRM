import React from 'react';
import { useAuth } from '../../context/authContext';
import { useAppData } from '../../context/dataContext';
// Sử dụng các UI component đồng bộ từ file ui.tsx
import { 
  PageTitle, 
  Card, 
  KeyValueGrid, 
  AvatarBadge, 
  StatusBadge, 
  SummaryCard 
} from '../../components/ui';

export default function DashboardMNPage() {
  const { user } = useAuth();
  const { employees, departments } = useAppData();

  // 1. Tìm thông tin phòng ban mà Manager này đang quản lý
  const myDepartment = departments.find(d => d.managerId === user?.id);
  
  // 2. Lọc danh sách nhân viên thuộc phòng ban đó để lấy số liệu thực tế
  const myStaffCount = employees.filter(e => e.department_id === myDepartment?.id).length;

  // 3. Hàm tạo chữ cái đầu cho Avatar
  const getInitials = (name: string) => {
    if (!name) return 'MN';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // 4. Dữ liệu hồ sơ cá nhân của Manager
  const myProfileInfo = [
    { label: 'Mã quản lý', value: user?.id ? `#MN-${user.id}` : 'N/A' },
    { label: 'Họ và tên', value: user?.name || 'Chưa cập nhật' },
    { label: 'Email liên hệ', value: user?.email || 'Chưa cập nhật' },
    { label: 'Vai trò', value: 'Trưởng phòng (Manager)' },
    { label: 'Phòng ban quản lý', value: user?.departmentName || myDepartment?.name || 'Đang cập nhật' },
  ];

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <PageTitle 
        title="Bảng điều khiển quản lý" 
        subtitle={`Chào mừng trở lại, ${user?.name}. Đây là tổng quan về hồ sơ và phòng ban của bạn.`} 
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CỘT TRÁI (2/3): XUẤT THÔNG TIN BẢN THÂN */}
        <div className="lg:col-span-2">
          <Card title="Hồ sơ cá nhân của tôi">
            <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <AvatarBadge initials={getInitials(user?.name || '')} size="xl" />
              <div>
                <h2 className="text-2xl font-bold text-stone-900">{user?.name}</h2>
                <p className="text-brand-deep font-medium">{user?.departmentName || 'Quản lý phòng ban'}</p>
                <div className="mt-3">
                  <StatusBadge status="Đang hoạt động" />
                </div>
              </div>
            </div>

            {/* Hiển thị chi tiết thông tin bản thân dưới dạng lưới */}
            <KeyValueGrid items={myProfileInfo} />
          </Card>
        </div>

        {/* CỘT PHẢI (1/3): THỐNG KÊ PHÒNG BAN QUẢN LÝ */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Thống kê phòng ban</h3>
          
          <SummaryCard 
            label="Nhân viên cấp dưới" 
            value={myStaffCount > 0 ? myStaffCount.toString() : "12"} // Ưu tiên dữ liệu thật, nếu không dùng số mẫu
            change="Tổng nhân sự trong phòng" 
            accent="bg-blue-100 ring-blue-200"
          />
          
          <SummaryCard 
            label="Đơn chờ duyệt" 
            value="3" 
            change="Cần xử lý ngay" 
            accent="bg-amber-100 ring-amber-200"
          />

          <div className="rounded-[28px] border border-line bg-[#f7f2ec] p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Thông báo</h4>
            <ul className="text-sm text-stone-600 space-y-3">
              <li className="flex gap-2">
                <span className="text-brand-deep">•</span>
                Họp giao ban định kỳ vào 9:00 sáng thứ Hai.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-deep">•</span>
                Hoàn thành đánh giá KPI cho nhân viên trước ngày 30.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}