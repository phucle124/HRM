import React, { useEffect, useState } from 'react';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface Department {
  department_id: number;
  name: string;
  manager_id: number | null;
  manager?: string;
}

export default function DepartmentsEJSPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Lấy danh sách phòng ban từ backend
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/departments`);
      const result = await res.json();
      setDepartments(result.data);
    } catch (error) {
      console.error('Lỗi load phòng ban:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Mở popup EJS tạo phòng ban
  const openCreateForm = () => {
    window.open(`${BASE_URL}/create-departmentPage`, '_blank', 'width=600,height=600');
  };

  // Mở popup EJS sửa phòng ban
  const openEditForm = (id: number) => {
    window.open(`${BASE_URL}/edit-department/${id}`, '_blank', 'width=600,height=600');
  };

  // Xóa phòng ban (vẫn phải reload trang để thấy thay đổi)
  const deleteDepartment = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng ban này?')) {
      window.location.href = `${BASE_URL}/delete-department/${id}`;
    }
  };

  return (
    <div className="container mt-5">
      <h2>Quản lý Phòng ban (EJS Backend)</h2>
      <button className="btn btn-success mb-3" onClick={openCreateForm}>
        + Tạo phòng ban
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên phòng ban</th>
            <th>Quản lý</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.department_id}>
              <td>{dept.department_id}</td>
              <td>{dept.name}</td>
              <td>{dept.manager || 'Chưa có'}</td>
              <td>
                <button className="btn btn-primary me-2" onClick={() => openEditForm(dept.department_id)}>
                  Sửa
                </button>
                <button className="btn btn-danger" onClick={() => deleteDepartment(dept.department_id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Lưu ý: Thêm/Sửa/Xóa sẽ dùng form EJS của backend, sau khi submit backend sẽ redirect lại.</p>
    </div>
  );
}