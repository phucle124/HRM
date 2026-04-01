import { useMemo, useState } from 'react';
import { Card, EmployeeChip, Input, MetricRow, Modal, PageTitle, PrimaryButton, SecondaryButton, StatusBadge, Table } from '../../components/ui';
import { formatCurrency } from '../../data/mockData';
import { useAppData } from '../../context/dataContext';

export default function SalaryPage() {
  const { employees, salaryRecords, runPayroll } = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState({ month: '04/2026', allowance: '1500000', bonus: '1000000', deduction: '250000' });

  const totalPayroll = useMemo(() => salaryRecords.reduce((sum, item) => sum + item.total, 0), [salaryRecords]);
  const totalBonus = useMemo(() => salaryRecords.reduce((sum, item) => sum + item.bonus, 0), [salaryRecords]);
  const totalDeduction = useMemo(() => salaryRecords.reduce((sum, item) => sum + item.deduction, 0), [salaryRecords]);

  const handleRunPayroll = () => {
    runPayroll({
      month: form.month,
      allowance: Number(form.allowance || 0),
      bonus: Number(form.bonus || 0),
      deduction: Number(form.deduction || 0),
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Lương" subtitle="Quản lý lương, phụ cấp, thưởng và khấu trừ theo tháng." action={<PrimaryButton onClick={() => setOpen(true)}>Chạy bảng lương</PrimaryButton>} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Tổng quan bảng lương" subtitle={`Đang có ${employees.length} nhân viên trong kỳ gần nhất`}>
          <div className="space-y-3">
            <MetricRow label="Tổng quỹ lương" value={totalPayroll} note="Đã bao gồm phụ cấp, thưởng và khấu trừ" />
            <MetricRow label="Tổng thưởng" value={totalBonus} note="Thưởng KPI và hiệu suất" />
            <MetricRow label="Tổng khấu trừ" value={totalDeduction} note="Khấu trừ nội quy và bảo hiểm" />
          </div>
        </Card>

        <Card title="Bảng lương nhân viên" subtitle="Danh sách chi trả hiện tại">
          <Table columns={['Nhân viên', 'Tháng', 'Lương cơ bản', 'Phụ cấp', 'Thưởng', 'Thực nhận', 'Trạng thái']}>
            {salaryRecords.map((item) => {
              const employee = employees.find((entry) => entry.id === item.employeeId);
              return (
                <tr key={`${item.id}-${item.month}`} className="transition-colors hover:bg-[#faf6f1]">
                  <td className="px-5 py-4">
                    <EmployeeChip name={item.employeeName} detail={`ID ${item.employeeId}`} avatar={employee?.avatar ?? item.employeeName.slice(0, 2).toUpperCase()} avatarUrl={employee?.avatarUrl} compact />
                  </td>
                  <td className="px-5 py-4">{item.month}</td>
                  <td className="px-5 py-4">{formatCurrency(item.basicSalary)}</td>
                  <td className="px-5 py-4">{formatCurrency(item.allowance)}</td>
                  <td className="px-5 py-4">{formatCurrency(item.bonus)}</td>
                  <td className="px-5 py-4 font-semibold text-stone-900">{formatCurrency(item.total)}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                </tr>
              );
            })}
          </Table>
        </Card>
      </div>

      <Modal open={isOpen} onClose={() => setOpen(false)} title="Chạy bảng lương" description="Thiết lập nhanh kỳ lương để tạo dữ liệu demo cho toàn bộ nhân viên">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Kỳ lương" value={form.month} onChange={(value) => setForm((prev) => ({ ...prev, month: value }))} placeholder="VD: 04/2026" />
          <div className="rounded-2xl bg-[#f7f2ec] p-4 text-sm text-stone-600 ring-1 ring-line">
            Hệ thống sẽ tạo bảng lương FE cho {employees.length} nhân viên và cập nhật trạng thái <span className="font-semibold">Chờ duyệt</span>.
          </div>
          <Input label="Phụ cấp chung" type="number" value={form.allowance} onChange={(value) => setForm((prev) => ({ ...prev, allowance: value }))} />
          <Input label="Thưởng chung" type="number" value={form.bonus} onChange={(value) => setForm((prev) => ({ ...prev, bonus: value }))} />
          <div className="md:col-span-2">
            <Input label="Khấu trừ chung" type="number" value={form.deduction} onChange={(value) => setForm((prev) => ({ ...prev, deduction: value }))} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setOpen(false)}>Đóng</SecondaryButton>
          <PrimaryButton onClick={handleRunPayroll} disabled={!form.month}>Chạy bảng lương</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
