import { useState } from 'react';
import { Card, EmployeeChip, Input, Modal, PageTitle, PrimaryButton, SecondaryButton, Select, StatusBadge, Table } from '../../components/ui';
import { formatCurrency } from '../../data/mockData';
import { useAppData } from '../../context/dataContext';

export default function ContractsPage() {
  const { contractRecords, employees, addContract } = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState({
    employeeId: String(employees[0]?.id ?? 1),
    contractType: 'Chính thức',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    salary: '18000000',
  });

  const handleSubmit = () => {
    addContract({
      employeeId: Number(form.employeeId),
      contractType: form.contractType as 'Chính thức' | 'Thử việc' | 'Thời vụ',
      startDate: form.startDate,
      endDate: form.endDate,
      salary: Number(form.salary || 0),
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Hợp đồng" subtitle="Theo dõi thời hạn hợp đồng, mức lương và gia hạn." action={<PrimaryButton onClick={() => setOpen(true)}>Tạo hợp đồng</PrimaryButton>} />
      <Card title="Danh sách hợp đồng" subtitle="Tất cả hợp đồng lao động hiện có">
        <Table columns={['Nhân viên', 'Loại hợp đồng', 'Bắt đầu', 'Kết thúc', 'Mức lương', 'Trạng thái']}>
          {contractRecords.map((item) => {
            const employee = employees.find((entry) => entry.id === item.employeeId);
            return (
              <tr key={item.id} className="transition-colors hover:bg-[#faf6f1]">
                <td className="px-5 py-4"><EmployeeChip name={item.employeeName} detail={employee?.department ?? 'Chưa có phòng ban'} avatar={employee?.avatar ?? item.employeeName.slice(0, 2).toUpperCase()} avatarUrl={employee?.avatarUrl} compact /></td>
                <td className="px-5 py-4">{item.contractType}</td>
                <td className="px-5 py-4">{item.startDate}</td>
                <td className="px-5 py-4">{item.endDate}</td>
                <td className="px-5 py-4">{formatCurrency(item.salary)}</td>
                <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
              </tr>
            );
          })}
        </Table>
      </Card>

      <Modal open={isOpen} onClose={() => setOpen(false)} title="Tạo hợp đồng" description="Khởi tạo mới hợp đồng lao động để hiển thị trong danh sách">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Nhân viên"
            value={form.employeeId}
            onChange={(value) => setForm((prev) => ({ ...prev, employeeId: value }))}
            options={employees.map((employee) => ({ label: `${employee.fullName} - ${employee.code}`, value: String(employee.id) }))}
          />
          <Select
            label="Loại hợp đồng"
            value={form.contractType}
            onChange={(value) => setForm((prev) => ({ ...prev, contractType: value }))}
            options={[
              { label: 'Chính thức', value: 'Chính thức' },
              { label: 'Thử việc', value: 'Thử việc' },
              { label: 'Thời vụ', value: 'Thời vụ' },
            ]}
          />
          <Input label="Ngày bắt đầu" type="date" value={form.startDate} onChange={(value) => setForm((prev) => ({ ...prev, startDate: value }))} />
          <Input label="Ngày kết thúc" type="date" value={form.endDate} onChange={(value) => setForm((prev) => ({ ...prev, endDate: value }))} />
          <div className="md:col-span-2">
            <Input label="Mức lương" type="number" value={form.salary} onChange={(value) => setForm((prev) => ({ ...prev, salary: value }))} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setOpen(false)}>Hủy</SecondaryButton>
          <PrimaryButton onClick={handleSubmit}>Lưu hợp đồng</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}