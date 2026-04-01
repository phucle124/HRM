import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, EmployeeChip, MiniBars, PageTitle, PrimaryButton, StatusBadge, SummaryCard, Table } from '../../components/ui';
import { departmentPerformance } from '../../data/mockData';
import { useAppData } from '../../context/dataContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { employees, attendanceRecords, leaveRecords, contractRecords, salaryRecords } = useAppData();

  const stats = useMemo(
    () => [
      { label: 'Tổng nhân viên', value: String(employees.length), change: 'Cập nhật theo danh sách nhân sự hiện tại' },
      { label: 'Đi làm hôm nay', value: String(attendanceRecords.filter((item) => item.status !== 'Nghỉ phép').length), change: 'Bao gồm cả nhân viên remote' },
      { label: 'Đơn nghỉ chờ duyệt', value: String(leaveRecords.filter((item) => item.status === 'Chờ duyệt').length).padStart(2, '0'), change: 'Các đơn đang cần HR xử lý' },
      { label: 'Bảng lương hiện có', value: String(salaryRecords.length), change: 'Số dòng dữ liệu lương trong hệ thống' },
    ],
    [attendanceRecords, employees.length, leaveRecords, salaryRecords.length],
  );

  return (
     <div className="space-y-6">
      <PageTitle
        title="Bảng điều khiển nhân sự"
        subtitle="Theo dõi nhanh tình hình nhân sự, chấm công và các hồ sơ cần xử lý trong ngày."
        action={<PrimaryButton onClick={() => navigate('/hr/employees')}>Thêm nhân viên</PrimaryButton>}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <SummaryCard key={item.label} {...item} accent="bg-brand-soft" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Chấm công hôm nay" subtitle="Danh sách chấm công và trạng thái làm việc mới nhất">
          <Table columns={['Nhân viên', 'Ngày', 'Giờ vào', 'Giờ ra', 'Trạng thái']}>
            {attendanceRecords.slice(0, 5).map((item) => {
              const employee = employees.find((entry) => entry.id === item.employeeId);
              return (
                <tr key={item.id}>
                  <td className="px-5 py-4"><EmployeeChip name={item.employeeName} detail={`Mã NV #${item.employeeId}`} avatar={employee?.avatar ?? item.employeeName.slice(0, 2).toUpperCase()} avatarUrl={employee?.avatarUrl} compact /></td>
                  <td className="px-5 py-4">{item.date}</td>
                  <td className="px-5 py-4">{item.checkIn}</td>
                  <td className="px-5 py-4">{item.checkOut}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                </tr>
              );
            })}
          </Table>
        </Card>

        <Card title="Hiệu suất theo phòng ban" subtitle="Tỷ lệ hoàn thành công việc trong tháng hiện tại">
          <MiniBars data={departmentPerformance} />
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Đơn nghỉ phép cần xử lý" subtitle="Danh sách các yêu cầu đang chờ HR xem xét">
          <div className="space-y-4">
            {leaveRecords.map((item) => (
              <div key={item.id} className="rounded-2xl border border-line bg-[#fffaf5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900">{item.employeeName}</p>
                    <p className="mt-1 text-sm text-stone-500">{item.type} · {item.startDate} → {item.endDate} · {item.days} ngày</p>
                    <p className="mt-2 text-sm text-stone-600">{item.reason}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Hợp đồng sắp hết hạn" subtitle="Theo dõi để chủ động gia hạn hoặc cập nhật hồ sơ">
          <div className="space-y-4">
            {contractRecords.map((item) => (
              <div key={item.id} className="rounded-2xl border border-line bg-[#fffaf5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900">{item.employeeName}</p>
                    <p className="mt-1 text-sm text-stone-500">{item.contractType} · Hết hạn {item.endDate}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
   
  );
}
