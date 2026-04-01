import { useState } from 'react';
import { Card, Modal, PageTitle, PrimaryButton, SecondaryButton, Select, StatusBadge, Table, Textarea, Input } from '../../components/ui';
import { useAppData } from '../../context/dataContext';

export default function RewardsPage() {
  const { rewardRecords, employees, addDecision } = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState({
    employeeName: employees[0]?.fullName ?? '',
    category: 'Khen thưởng',
    title: '',
    date: '2026-03-21',
    amount: '+1.000.000đ',
    note: '',
  });

  const handleSubmit = () => {
    addDecision({
      employeeName: form.employeeName,
      category: form.category as 'Khen thưởng' | 'Kỷ luật',
      title: form.title,
      date: form.date,
      amount: form.amount,
      note: form.note,
    });
    setOpen(false);
    setForm((prev) => ({ ...prev, title: '', note: '', amount: '+1.000.000đ' }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Khen thưởng và kỷ luật" subtitle="Quản lý quyết định thưởng - phạt gắn với hồ sơ nhân viên." action={<PrimaryButton onClick={() => setOpen(true)}>Tạo quyết định</PrimaryButton>} />
      <Card title="Lịch sử quyết định" subtitle="Danh sách khen thưởng và kỷ luật toàn công ty">
        <Table columns={['Nhân viên', 'Loại', 'Quyết định', 'Ngày', 'Giá trị', 'Ghi chú']}>
          {rewardRecords.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-[#faf6f1]">
              <td className="px-5 py-4 font-semibold text-stone-900">{item.employeeName}</td>
              <td className="px-5 py-4"><StatusBadge status={item.category} /></td>
              <td className="px-5 py-4">{item.title}</td>
              <td className="px-5 py-4">{item.date}</td>
              <td className="px-5 py-4 font-semibold text-stone-900">{item.amount}</td>
              <td className="px-5 py-4">{item.note}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={isOpen} onClose={() => setOpen(false)} title="Tạo quyết định" description="Lưu quyết định thưởng hoặc kỷ luật để bổ sung vào hồ sơ nhân viên">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Nhân viên"
            value={form.employeeName}
            onChange={(value) => setForm((prev) => ({ ...prev, employeeName: value }))}
            options={employees.map((employee) => ({ label: employee.fullName, value: employee.fullName }))}
          />
          <Select
            label="Loại quyết định"
            value={form.category}
            onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
            options={[
              { label: 'Khen thưởng', value: 'Khen thưởng' },
              { label: 'Kỷ luật', value: 'Kỷ luật' },
            ]}
          />
          <Input label="Tiêu đề quyết định" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
          <Input label="Ngày hiệu lực" type="date" value={form.date} onChange={(value) => setForm((prev) => ({ ...prev, date: value }))} />
          <div className="md:col-span-2">
            <Input label="Giá trị" value={form.amount} onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Nội dung" value={form.note} onChange={(value) => setForm((prev) => ({ ...prev, note: value }))} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setOpen(false)}>Hủy</SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={!form.title || !form.note}>Lưu quyết định</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
