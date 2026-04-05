//Quy tắt viết regex trong javascript = /^...$/

const validateEmail = (req,res,next) =>{
    const email = req.body.email;

    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if(!email || !regex.test(email)){
        return res.status(400).json({message: "Email không hợp lệ"});
    }

    //Nếu ko rơi vào trường hợp email không hợp lệ
    // thì req sẽ chuyển qua phần tiếp theo (next()) để xử lí (coi chi tiết trong dòng api cụ thể để biết)
    next();

};

const validatePassword = (req,res,next) =>{
    const pass = req.body.password;

    const regex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/; 

    if(!pass || !regex.test(pass)){
        return res.status(400).json({message: "Mật khẩu không hợp lệ"});
    };

    next();

};

const validatePhone = (req,res,next)=>{
    const phone = req.body.phone;

    const regex = /^\d{10,11}$/;

    if(!phone || !regex.test(phone)){
        return res.status(400).json({message: "Số điện thoại không hợp lệ"});
    }

    next();
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhone,

}