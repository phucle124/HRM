const e = require("express");
const { checkManager } = require("../services/CRUDService");

const checkRole = (req,res,next)=>{
    if (!req.session || !req.session.user) {
        return res.status(401).json({message: "Phiên đăng nhập không khả dụng."});
    }

    const Role = req.session.user.role; // 'admin', 'hr', hoặc 'employee'
    const url = req.originalUrl;

    if(url.includes('/admin/') && Role !== 'admin')
        return res.status(403).json({message: "Chỉ có admin mới có quyền truy cập"});

    if(url.includes('/hr/') && Role !== 'hr')
        return res.status(403).json({message: "Chỉ có hr mới có truy cập"})
    
    next();
};

const checkRole2 = (allowedRoles) => {
    return (req, res, next) => {

        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).json({ message: "Không có quyền" });
        }

        next();
    };
};

const isManager = ()=>{
    return async (req,res,next)=>{
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        const userId = req.session.user.id;
        let Manager = await checkManager(userId);
        if(!Manager || Manager.length === 0) return res.status(403).json({ message: "Không phải manager" });
        
        next();
    };
};

module.exports = {
    checkRole2,
    isManager,
};