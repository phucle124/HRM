const ManagerService = require('../services/ManagerService');

const ManagerController = {
    // 1. Lấy danh sách nhân viên
    getStaffPage: async (req, res) => {
        try {
            const managerId = 1; 
            const staffList = await ManagerService.getStaffList(managerId);
            return res.status(200).json({
                message: "Lấy danh sách nhân viên thành công",
                data: staffList
            });
        } catch (error) {
            console.log("Lỗi chi tiết:", error); 
            return res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    },

    // 2. Duyệt nghỉ phép (Tính năng trọng tâm cho báo cáo)
    approveLeave: async (req, res) => {
        try {
            // Lấy leave_id (viết thường theo chuẩn Database đã test) từ Body của Request
            const { leave_id, status } = req.body; 

            // Kiểm tra tính đầy đủ của dữ liệu gửi lên
            if (!leave_id || !status) {
                return res.status(400).json({ 
                    message: "Thiếu dữ liệu đầu vào: Cần có leave_id và status" 
                });
            }

            // Gọi Service thực hiện cập nhật trạng thái trong Database
            const result = await ManagerService.updateLeaveStatus(leave_id, status);

            // Xử lý trường hợp không tìm thấy mã đơn cần duyệt trong hệ thống
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    message: `Không tìm thấy đơn nghỉ phép có ID: ${leave_id}` 
                });
            }

            // Phản hồi kết quả thành công cho Client (Postman)
            return res.status(200).json({
                message: `Duyệt đơn thành công! ID ${leave_id} đã được chuyển sang trạng thái: ${status}`
            });

        } catch (error) {
            console.log("Lỗi duyệt đơn:", error);
            return res.status(500).json({ 
                message: "Lỗi hệ thống khi thực hiện duyệt đơn", 
                error: error.message 
            });
        }
    }
};

module.exports = ManagerController;