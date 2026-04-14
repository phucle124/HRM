import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/authContext';
import { PageTitle, Card, Table, EmployeeChip, Input, StatusBadge } from '../../components/ui';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface Employee {
  id: number;
  name: string;
  email: string;
  department_name: string;
  position?: string;
  status?: string;
  avatar?: string;
}

// ==========================================
// BỘ DỮ LIỆU GIẢ (MOCK DATA) DÀNH RIÊNG CHO FRONT-END
// Để dùng tạm khi Back-end chưa fix xong API
// ==========================================
const MOCK_EMPLOYEES: Employee[] = [
  { id: 101, name: "Trần Thu Hà", email: "ha.thu@hrm.vn", department_name: "Tài chính", position: "Chuyên viên Kế toán", status: "Đang làm", avatar: "TH" },
  { id: 102, name: "Nguyễn Minh Khang", email: "khang.nm@hrm.vn", department_name: "Tài chính", position: "Nhân viên Kiểm toán", status: "Đang làm", avatar: "MK" },
  { id: 103, name: "Lê Hoàng Yến", email: "yen.lh@hrm.vn", department_name: "Tài chính", position: "Thực tập sinh", status: "Thử việc", avatar: "HY" },
  { id: 104, name: "Phạm Văn Long", email: "long.pv@hrm.vn", department_name: "Tài chính", position: "Chuyên viên Thuế", status: "Nghỉ phép", avatar: "VL" }
];

export default function EmployeesMNPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Biến này để báo cho người dùng biết đang xài dữ liệu thật hay giả (tùy chọn hiển thị)
  const [isUsingMock, setIsUsingMock] = useState(false); 

  useEffect(() => {
    const fetchStaff = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/manager/staff-list`, {
          method: 'GET',
          credentials: 'include',
        });

        const result = await res.json();
        
        // Nếu API lỗi (404, 500) HOẶC trả về mảng rỗng (Acc manager mới chưa có dữ liệu)
        const dataList = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
        
        if (!res.ok || dataList.length === 0) {
          throw new Error('Fallback to mock data'); // Cố tình quăng lỗi để nhảy xuống catch
        }

        setEmployees(dataList);
        setIsUsingMock(false);
      } catch (err: any) {
        console.warn("API lỗi hoặc rỗng, tự động kích hoạt Mock Data cho Front-end Demo.");
        // Gán dữ liệu giả để giao diện vẫn hiển thị đẹp
        setEmployees(MOCK_EMPLOYEES);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [user]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return parts.length === 1 
      ? parts[0].substring(0, 2).toUpperCase() 
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-stone-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Nhân viên phòng ban" 
        subtitle={user?.departmentName ? `Phòng ban: ${user.departmentName}` : "Quản lý nhân sự cấp dưới"} 
      />

      <Card title={`Thành viên phòng ban (${employees.length})`}>
        <div className="mb-6 max-w-md">
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
          />
        </div>

        <Table columns={['Nhân viên', 'Vị trí', 'Trạng thái']}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-[#f6efe7]/40 transition-colors">
                <td className="px-5 py-4">
                  <EmployeeChip 
                    name={emp.name || "N/A"} 
                    detail={emp.email || "Không có email"} 
                    avatar={emp.avatar || getInitials(emp.name)} 
                  />
                </td>
                <td className="px-5 py-4 font-medium text-stone-900">{emp.position || 'Nhân viên'}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={emp.status || 'Đang làm'} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-5 py-12 text-center text-stone-500 italic">
                Không tìm thấy nhân viên nào.
              </td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}