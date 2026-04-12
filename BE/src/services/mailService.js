const nodemailer = require('nodemailer');
require('dotenv').config();

// Đổi tên hàm thành sendAccountEmail cho khớp với code của Trí để ông ấy dễ gọi
const sendAccountEmail = async (toEmail, employeeName, accountInfo) => {
    
    // 1. Cấu hình Transporter dùng Gmail "Doanh nghiệp ảo" của ông
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hrm.manager.support@gmail.com', // Email mới tạo của ông
            pass: 'jkznnknxdpnbrhty'            // Mã App Password ông vừa lấy
        },
    tls: {
        rejectUnauthorized: false
    }
});

    // 2. Nội dung Email (Giữ nguyên template HTML xịn của Trí)
    const mailOptions = {
        // Chỉnh lại From cho chuyên nghiệp
        from: '"Phòng Nhân sự HRM" <hrm.manager.support@gmail.com>', 
        to: toEmail,
        subject: 'Thông tin tài khoản hệ thống HRM',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2c3e50;">Chào ${employeeName},</h2>
                <p>Hệ thống HRM đã cấp tài khoản truy cập cho bạn.</p>
                <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Tên đăng nhập:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${accountInfo.username}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Mật khẩu:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${accountInfo.password}</td>
                    </tr>
                </table>
                <p style="color: red;"><i>Lưu ý: Vui lòng đổi mật khẩu trong lần đầu đăng nhập.</i></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully via HRM Support System!");
        return true;
    } catch (error) {
        console.error("❌ Email System Error:", error);
        return false;
    }
};

module.exports = { sendAccountEmail };