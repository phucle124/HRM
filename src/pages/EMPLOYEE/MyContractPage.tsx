import { Card, InlineMessage, KeyValueGrid, PageTitle, StatusBadge } from '../../components/ui';
import { formatCurrency } from '../../data/mockData';
import { useAppData } from '../../context/dataContext';

export default function MyContractPage() {
  const { currentEmployeeContract } = useAppData();

  return (
    <div className="space-y-6">
      <PageTitle title="Hợp đồng của tôi" subtitle="Tra cứu loại hợp đồng, thời hạn và mức lương hiện hành." />
      {currentEmployeeContract ? (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card title="Tình trạng hợp đồng" subtitle="Thông tin tổng quan">
            <div className="rounded-[28px] bg-[#f7f2ec] p-6 ring-1 ring-line">
              <p className="text-sm uppercase tracking-[0.25em] text-brand-deep">Loại hợp đồng</p>
              <h3 className="mt-3 text-3xl font-bold text-stone-900">{currentEmployeeContract.contractType}</h3>
              <div className="mt-5"><StatusBadge status={currentEmployeeContract.status} /></div>
            </div>
          </Card>
          <Card title="Chi tiết hợp đồng" subtitle="Các trường dữ liệu đang lưu trên hệ thống">
            <KeyValueGrid
              items={[
                { label: 'Ngày bắt đầu', value: currentEmployeeContract.startDate },
                { label: 'Ngày kết thúc', value: currentEmployeeContract.endDate },
                { label: 'Lương cơ bản', value: formatCurrency(currentEmployeeContract.salary) },
                { label: 'Trạng thái', value: currentEmployeeContract.status },
              ]}
            />
          </Card>
        </div>
      ) : (
        <InlineMessage>Hiện chưa có hợp đồng nào hiển thị cho tài khoản này.</InlineMessage>
      )}
    </div>
  );
}
