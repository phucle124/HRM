import { useState } from 'react';
import { Card, EmployeeChip, Modal, PageTitle, PrimaryButton, SecondaryButton, Select, StatusBadge, SummaryCard, Table } from '../../components/ui';
import { useAppData } from '../../context/dataContext';

function downloadAttendance(content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'bao-cao-cham-cong.txt';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AttendancePage() {
  const { attendanceRecords, employees } = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [reportType, setReportType] = useState('Trong ngày');
  const totalPresent = attendanceRecords.filter((item) => item.status !== 'Nghỉ phép').length;
  const totalLate = attendanceRecords.filter((item) => item.status === 'Đi muộn').length;
  const remote = attendanceRecords.filter((item) => item.status === 'Làm từ xa').length;

  const preview = `Báo cáo chấm công - ${reportType}\nĐi làm hôm nay: ${totalPresent}\nĐi muộn: ${totalLate}\nLàm từ xa: ${remote}`;

  return (
    <div className="space-y-6">
      <PageTitle title="Chấm công" subtitle="Theo dõi check-in, check-out và trạng thái làm việc hằng ngày." action={<PrimaryButton onClick={() => setOpen(true)}>Xuất báo cáo</PrimaryButton>} />
      <div className="grid gap-5 md:grid-cols-3">
        <SummaryCard label="Đi làm hôm nay" value={String(totalPresent)} change="Nhân sự có mặt tại hệ thống" accent="bg-brand-soft" />
        <SummaryCard label="Đi muộn" value={String(totalLate)} change="Cần nhắc nhở hoặc điều chỉnh" accent="bg-amber-50" />
        <SummaryCard label="Làm từ xa" value={String(remote)} change="Đã ghi nhận online" accent="bg-[#f1ebe4]" />
      </div>
      <Card title="Nhật ký chấm công" subtitle="Dữ liệu chấm công trong ngày 19/03/2026">
        <Table columns={['Nhân viên', 'Ngày', 'Check in', 'Check out', 'Số giờ', 'Trạng thái']}>
          {attendanceRecords.map((item) => {
            const employee = employees.find((entry) => entry.id === item.employeeId);
            return (
              <tr key={item.id}>
                <td className="px-5 py-4"><EmployeeChip name={item.employeeName} detail={`ID ${item.employeeId}`} avatar={employee?.avatar ?? item.employeeName.slice(0, 2).toUpperCase()} avatarUrl={employee?.avatarUrl} compact /></td>
                <td className="px-5 py-4">{item.date}</td>
                <td className="px-5 py-4">{item.checkIn}</td>
                <td className="px-5 py-4">{item.checkOut}</td>
                <td className="px-5 py-4">{item.hours.toFixed(1)}h</td>
                <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
              </tr>
            );
          })}
        </Table>
      </Card>

      <Modal open={isOpen} onClose={() => setOpen(false)} title="Xuất báo cáo chấm công" description="Tải nhanh một file báo cáo demo từ giao diện FE">
        <div className="space-y-4">
          <Select
            label="Loại báo cáo"
            value={reportType}
            onChange={setReportType}
            options={[
              { label: 'Trong ngày', value: 'Trong ngày' },
              { label: 'Theo tuần', value: 'Theo tuần' },
              { label: 'Theo tháng', value: 'Theo tháng' },
            ]}
          />
          <div className="rounded-2xl bg-[#f7f2ec] p-4 text-sm text-stone-700 ring-1 ring-line whitespace-pre-line">{preview}</div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setOpen(false)}>Đóng</SecondaryButton>
          <PrimaryButton onClick={() => downloadAttendance(preview)}>Xuất file</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
