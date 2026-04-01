import { ChangeEvent, useMemo } from 'react';
import {
  AvatarBadge,
  Card,
  InlineMessage,
  KeyValueGrid,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  SummaryCard,
} from '../../components/ui';
import { useAppData } from '../../context/dataContext';

function downloadProfile(content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'hoso-nhan-vien.txt';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ProfilePage() {
  const {
    currentEmployee,
    currentEmployeeSalary,
    currentEmployeeContract,
    updateEmployeeAvatar,
  } = useAppData();

  if (!currentEmployee) {
    return <div>Không tìm thấy thông tin nhân viên</div>;
  }

  const stats = useMemo(
    () => [
      {
        label: 'Ngày công tháng này',
        value: '18',
        change: '2 ngày remote',
      },
      {
        label: 'Số ngày phép còn lại',
        value: String(currentEmployee.leaveBalance ?? 0),
        change: 'Cập nhật từ hồ sơ phép năm',
      },
      {
        label: 'Lương gần nhất',
        value: currentEmployeeSalary
          ? new Intl.NumberFormat('vi-VN').format(currentEmployeeSalary.total) + 'đ'
          : 'Chưa có dữ liệu',
        change: currentEmployeeSalary?.status ?? '',
      },
      {
        label: 'Trạng thái hợp đồng',
        value: currentEmployeeContract?.status ?? 'Chưa có hợp đồng',
        change: currentEmployeeContract
          ? `Đến ${currentEmployeeContract.endDate}`
          : '',
      },
    ],
    [currentEmployee, currentEmployeeSalary, currentEmployeeContract]
  );

  const profileExport = [
    `Mã nhân viên: ${currentEmployee.code}`,
    `Họ tên: ${currentEmployee.fullName}`,
    `Email: ${currentEmployee.email}`,
    `Phòng ban: ${currentEmployee.department}`,
    `Chức vụ: ${currentEmployee.position}`,
  ].join('\n');

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    updateEmployeeAvatar(currentEmployee.id, url);
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Hồ sơ nhân viên"
        subtitle="Trang thông tin cá nhân để nhân viên theo dõi hồ sơ của mình."
        action={<PrimaryButton>Cập nhật hồ sơ</PrimaryButton>}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <SummaryCard key={item.label} {...item} accent="bg-brand-soft" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card title="Thông tin cá nhân" subtitle="Thẻ nhận diện nhân viên">
          <div className="flex flex-col items-center rounded-[28px] bg-[#f7f2ec] p-8 text-center ring-1 ring-line">
            <AvatarBadge
              initials={currentEmployee.avatar}
              imageUrl={currentEmployee.avatarUrl}
              size="xl"
            />

            <h3 className="mt-5 text-2xl font-bold text-stone-900">
              {currentEmployee.fullName}
            </h3>

            <p className="mt-1 text-stone-500">
              {currentEmployee.position} · {currentEmployee.department}
            </p>

            <div className="mt-4">
              <StatusBadge status={currentEmployee.status} />
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <span className="inline-flex rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-deep">
                  Đổi avatar
                </span>
              </label>

              <SecondaryButton onClick={() => downloadProfile(profileExport)}>
                Xuất hồ sơ
              </SecondaryButton>
            </div>

            <div className="mt-5 w-full text-left">
              <InlineMessage>
                Ảnh avatar hiện chỉ là FE preview.
              </InlineMessage>
            </div>
          </div>
        </Card>

        <Card title="Thông tin chi tiết" subtitle="Dữ liệu được đồng bộ với hồ sơ nhân sự">
          <KeyValueGrid
            items={[
              { label: 'Mã nhân viên', value: currentEmployee.code },
              { label: 'Email', value: currentEmployee.email },
              { label: 'Số điện thoại', value: currentEmployee.phone },
              { label: 'Giới tính', value: currentEmployee.gender },
              { label: 'Ngày sinh', value: currentEmployee.birthDate || 'Chưa cập nhật' },
              { label: 'Ngày vào làm', value: currentEmployee.joinDate },
              { label: 'Địa điểm', value: currentEmployee.location },
              { label: 'Số CCCD', value: currentEmployee.idNumber || 'Chưa cập nhật' },
              { label: 'Địa chỉ', value: currentEmployee.address || 'Chưa cập nhật' },
              {
                label: 'Liên hệ khẩn cấp',
                value: currentEmployee.emergencyContact || 'Chưa cập nhật',
              },
              {
                label: 'Số ngày phép còn lại',
                value: `${currentEmployee.leaveBalance} ngày`,
              },
              { label: 'Trạng thái', value: currentEmployee.status },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}