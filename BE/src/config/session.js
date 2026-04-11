// const session = require('express-session');
// require('dotenv').config();

// const sessionConfig = session({
//     secret: process.env.SESSION_SECRET,
//     name: 'hrm_session',

//     resave: false,
//     saveUninitialized: false,

//     cookie: {
//         httpOnly: true,
//         secure: true,       // true = HTTPS
//         sameSite: 'none',   // nếu FE khác domain vs BE
//         maxAge: 1000 * 60 * 60 * 2 // ~ 2h (đổi sang mili giây)
//     }
     
// });


// module.exports = sessionConfig;
const session = require('express-session');
require('dotenv').config();

// Thêm dòng này để kiểm tra xem nó có đọc được mã bí mật không (xem ở Terminal)
console.log("SESSION_SECRET hiện tại là:", process.env.SESSION_SECRET);

const sessionConfig = session({
    // THÊM GIÁ TRỊ DỰ PHÒNG: Nếu không đọc được từ .env thì lấy chuỗi bên phải
    secret: process.env.SESSION_SECRET || 'secret_key_du_phong_cho_tri',
    name: 'hrm_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // SỬA THÀNH FALSE: Để chạy được trên localhost
        secure: false, 
        sameSite: 'lax', // Sửa từ 'none' thành 'lax' cho localhost an toàn hơn
        maxAge: 1000 * 60 * 60 * 2 // ~ 2h
    }
});

module.exports = sessionConfig;