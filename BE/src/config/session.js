const session = require('express-session');
require('dotenv').config();

const sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    name: 'hrm_session',

    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: false,       // true = HTTPS
        sameSite: 'lax',   // nếu FE khác domain vs BE
        maxAge: 1000 * 60 * 60 * 2 // ~ 2h (đổi sang mili giây)
    }
     
});




module.exports = sessionConfig;