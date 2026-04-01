import { Card, PageTitle, StatusBadge, Table } from '../../components/ui';
import { useAppData } from '../../context/dataContext';

export default function MyAttendancePage() {
  const { currentEmployeeAttendance } = useAppData();

  return (
    <div className="space-y-6">
      <PageTitle title="Chấm công của tôi" subtitle="Theo dõi lịch sử đi làm, check-in và check-out cá nhân." />
      <Card title="Lịch sử chấm công" subtitle="Dữ liệu gần nhất của nhân viên đang đăng nhập">
        <Table columns={['Ngày', 'Giờ vào', 'Giờ ra', 'Số giờ', 'Trạng thái']}>
          {currentEmployeeAttendance.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-[#faf6f1]">
              <td className="px-5 py-4">{item.date}</td>
              <td className="px-5 py-4">{item.checkIn}</td>
              <td className="px-5 py-4">{item.checkOut}</td>
              <td className="px-5 py-4">{item.hours.toFixed(1)}h</td>
              <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
