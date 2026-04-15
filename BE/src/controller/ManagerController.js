const ManagerService = require('../services/ManagerService');

const ManagerController = {
    // 1. Lấy danh sách nhân viên (Cái ông đã làm)
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

    // 2. Duyệt nghỉ phép (Tính năng tôi vừa gợi ý thêm)
    approveLeave: async (req, res) => {
        try {
            // Dữ liệu này sẽ do Frontend (hoặc Postman) gửi lên
            const { leave_Id, status } = req.body; 

            if (!leave_Id || !status) {
                return res.status(400).json({ message: "Thiếu leaveId hoặc status (Approved/Rejected)" });
            }

            // Gọi Service để update Database
            await ManagerService.updateLeaveStatus(leave_Id, status);

            return res.status(200).json({
                message: `Đã cập nhật trạng thái đơn nghỉ phép thành: ${status}`
            });
        } catch (error) {
            console.log("Lỗi duyệt đơn:", error);
            return res.status(500).json({ message: "Lỗi Server khi duyệt đơn", error: error.message });
        }
    }
};

module.exports = ManagerController;