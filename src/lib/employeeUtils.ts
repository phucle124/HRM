import { fetchApi } from './api';
export interface EmployeeLike {
  id?: number;
  employee_id?: number;
  name?: string;
  full_name?: string;
  email?: string;
  department_name?: string;
  department_id?: number | null;
  [key: string]: any;
}

export interface EmployeeIdentity {
  employeeId?: number;
  name?: string;
  email?: string;
}

// Chuẩn hóa response API về một mảng để FE dùng thống nhất.
export function unwrapApiArray<T = any>(payload: any): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload?.data)) return payload.data as T[];
  if (Array.isArray(payload?.details)) return payload.details as T[];
  if (Array.isArray(payload?.summary)) return payload.summary as T[];
  return [];
}

// Chuẩn hóa danh sách nhân viên từ nhiều kiểu response khác nhau.
export function normalizeEmployeeRows(payload: any): EmployeeLike[] {
  return unwrapApiArray<EmployeeLike>(payload)
    .map((item: any) => ({
      ...item,
      id: Number(item.id ?? item.employee_id),
      employee_id:
        item.employee_id === null || item.employee_id === undefined || item.employee_id === ''
          ? undefined
          : Number(item.employee_id ?? item.id),
      name: String(item.name || item.full_name || '').trim(),
      full_name: String(item.full_name || item.name || '').trim(),
      email: String(item.email || '').trim(),
      department_name: String(item.department_name || item.department || '').trim() || undefined,
      department_id:
        item.department_id === null || item.department_id === undefined || item.department_id === ''
          ? null
          : Number(item.department_id),
    }))
    .filter((item) => Number.isFinite(item.id) && (item.name || item.full_name) && item.email);
}

// Tìm đúng nhân viên từ danh sách dựa vào id, email hoặc tên.
export function resolveEmployeeId(rows: EmployeeLike[], identity: EmployeeIdentity): number | undefined {
  if (!rows.length) return undefined;

  const byId = identity.employeeId
    ? rows.find((item) => Number(item.id ?? item.employee_id) === Number(identity.employeeId))
    : undefined;
  if (byId) return Number(byId.id ?? byId.employee_id);

  const targetEmail = normalizeText(identity.email);
  if (targetEmail) {
    const byEmail = rows.find((item) => normalizeText(item.email) === targetEmail);
    if (byEmail) return Number(byEmail.id ?? byEmail.employee_id);
  }

  const targetName = normalizeText(identity.name);
  if (targetName) {
    const byName = rows.find((item) => normalizeText(item.name || item.full_name) === targetName);
    if (byName) return Number(byName.id ?? byName.employee_id);
  }

  return undefined;
}

// Đổi ngày từ yyyy-mm-dd sang dd/mm/yyyy để khớp BE cũ.
export function toApiDate(value: string) {
  if (!value) return '';
  const parts = value.split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

// Hiển thị ngày an toàn khi API trả nhiều kiểu khác nhau.

export async function resolveEmployeeIdFromSources(
  identity: EmployeeIdentity & { userId?: number }
): Promise<number | undefined> {
  if (identity.employeeId) return Number(identity.employeeId);

  // Ưu tiên khớp theo user_id từ hồ sơ thật nếu BE có trả cột này.
  if (identity.userId) {
    try {
      const profile = await fetchApi<any>(`/employee/profile/${identity.userId}`);
      const directId = Number(profile?.employee_id ?? profile?.id);
      if (Number.isFinite(directId) && directId > 0) return directId;
    } catch {
      // Bỏ qua để thử các cách khớp khác.
    }
  }

  try {
    const employeesResponse = await fetchApi<any>('/employees');
    const rows = normalizeEmployeeRows(employeesResponse);
    return resolveEmployeeId(rows, identity);
  } catch {
    return undefined;
  }
}

export function formatDisplayDate(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  return text;
}

function normalizeText(value: unknown) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
