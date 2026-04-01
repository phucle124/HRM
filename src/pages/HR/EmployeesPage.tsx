import { useMemo, useState } from 'react';
import { Card, Drawer, EmployeeChip, Input, Modal, PageTitle, PrimaryButton, SecondaryButton, Select, StatusBadge, Table } from '../../components/ui';
import { useAppData } from '../../context/dataContext';
import type { Employee } from '../../types/hrm';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  gender: 'Nam',
  department: 'Nhân sự',
  position: '',
  status: 'Đang làm',
  joinDate: '2026-03-21',
  location: 'Hồ Chí Minh',
};

export default function EmployeesPage() {
  const { employees, departments, addEmployee } = useAppData();
  const [keyword, setKeyword] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const filtered = useMemo(
    () => employees.filter((item) => [item.fullName, item.department, item.position, item.code, item.email].join(' ').toLowerCase().includes(keyword.toLowerCase())),
    [employees, keyword],
  );

  const handleCreate = () => {
    addEmployee({
      ...form,
      gender: form.gender as 'Nam' | 'Nữ',
      status: form.status as Employee['status'],
    });
    setForm(initialForm);
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Danh sách nhân viên"
        subtitle="Quản lý hồ sơ nhân sự, trạng thái làm việc, phòng ban và thông tin liên hệ."
        action={<PrimaryButton onClick={() => setCreateOpen(true)}>Thêm nhân viên</PrimaryButton>}
      />

      <Card
        title="Thông tin nhân sự"
        subtitle="Tra cứu theo tên, phòng ban, mã nhân viên hoặc email"
        action={
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên, phòng ban, mã NV"
            className="w-72 rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-soft"
          />
        }
      >
        <Table columns={['Nhân viên', 'Mã', 'Phòng ban', 'Chức vụ', 'Liên hệ', 'Trạng thái', 'Thao tác']}>
          {filtered.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-[#faf6f1]">
              <td className="px-5 py-4">
                <button className="text-left" onClick={() => setSelectedEmployee(item)}>
                  <EmployeeChip name={item.fullName} detail={item.email} avatar={item.avatar} avatarUrl={item.avatarUrl} compact />
                </button>
              </td>
              <td className="px-5 py-4 font-semibold text-stone-900">{item.code}</td>
              <td className="px-5 py-4">{item.department}</td>
              <td className="px-5 py-4">{item.position}</td>
              <td className="px-5 py-4">{item.phone}</td>
              <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
              <td className="px-5 py-4">
                <SecondaryButton className="px-4 py-2" onClick={() => setSelectedEmployee(item)}>
                  Xem chi tiết
                </SecondaryButton>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Drawer
        open={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
        title="Chi tiết nhân viên"
        description="Thông tin hồ sơ đang hiển thị để HR kiểm tra nhanh"
      >
        {selectedEmployee ? (
          <div className="space-y-5">
            <div className="rounded-[28px] bg-[#f7f2ec] p-5 ring-1 ring-line">
              <EmployeeChip
                name={selectedEmployee.fullName}
                detail={`${selectedEmployee.position} · ${selectedEmployee.department}`}
                avatar={selectedEmployee.avatar}
                avatarUrl={selectedEmployee.avatarUrl}
              />
              <div className="mt-4"><StatusBadge status={selectedEmployee.status} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Mã nhân viên', selectedEmployee.code],
                ['Email', selectedEmployee.email],
                ['Số điện thoại', selectedEmployee.phone],
                ['Giới tính', selectedEmployee.gender],
                ['Ngày vào làm', selectedEmployee.joinDate],
                ['Địa điểm', selectedEmployee.location],
                ['Số CCCD', selectedEmployee.idNumber || 'Chưa cập nhật'],
                ['Liên hệ khẩn cấp', selectedEmployee.emergencyContact || 'Chưa cập nhật'],
                ['Địa chỉ', selectedEmployee.address || 'Chưa cập nhật'],
                ['Số ngày phép còn lại', `${selectedEmployee.leaveBalance} ngày`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-stone-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title="Thêm nhân viên"
        description="Tạo mới một hồ sơ nhân viên để hiển thị ngay trên giao diện"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Họ và tên" value={form.fullName} onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))} />
          <Input label="Email" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} type="email" />
          <Input label="Số điện thoại" value={form.phone} onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))} />
          <Input label="Chức vụ" value={form.position} onChange={(value) => setForm((prev) => ({ ...prev, position: value }))} />
          <Select label="Giới tính" value={form.gender} onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))} options={[{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }]} />
          <Select
            label="Phòng ban"
            value={form.department}
            onChange={(value) => setForm((prev) => ({ ...prev, department: value }))}
            options={departments.map((department) => ({ label: department.name, value: department.name }))}
          />
          <Select
            label="Trạng thái"
            value={form.status}
            onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
            options={[
              { label: 'Đang làm', value: 'Đang làm' },
              { label: 'Thử việc', value: 'Thử việc' },
              { label: 'Nghỉ phép', value: 'Nghỉ phép' },
            ]}
          />
          <Input label="Ngày vào làm" type="date" value={form.joinDate} onChange={(value) => setForm((prev) => ({ ...prev, joinDate: value }))} />
          <div className="md:col-span-2">
            <Input label="Nơi làm việc" value={form.location} onChange={(value) => setForm((prev) => ({ ...prev, location: value }))} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setCreateOpen(false)}>Hủy</SecondaryButton>
          <PrimaryButton onClick={handleCreate} disabled={!form.fullName || !form.email || !form.position}>
            Lưu nhân viên
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
