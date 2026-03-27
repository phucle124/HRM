const {login} = require('../services/AuthenticateService');
const connection = require('../config/db');
const {AllUsersData ,UserByIdData, CreateUser, UpdateUser, DeleteUser, LockUser, AllDepartmentsData, CreateDepartment, DeleteDepartment, EditDepartment, DepartmentByIdData, AllEmployeesData} = require('../services/CRUDService')





//EJS Pages
const HomePage = (req,res)=>{
    

    res.render('home');

}

const Logout = (req,res) =>{
    //Luôn xoá các thuộc tính cũ ĐÃ LƯU
    res.locals = {};

    res.render('home', {loggedOut: true})
}

const LoginPage = (req,res)=>{
    res.render('login');
}

const createUserPage = (req,res)=>{
    res.render('./admin/createUser');
}

const editUserPage = async (req,res)=>{
    const uid = req.params.id;

    let data = await UserByIdData(uid);

    res.render('./admin/editUser',{userEdit: data[0]});
}

const createDepartmentPage = (req,res)=>{
    res.render('./admin/createDepartment');
}

const editDepartmentPage = (req,res)=>{
    res.render('./admin/editDepartment')
}

//Handles
const LoginHandle = async (req,res) =>{

    //các thuộc tính (body.[thuộc tính]) là thuộc tính lấy trực tiếp từ giao diện    
    const { email, password } = req.body;
    let dataUser = await login(email,password);
    // try{
    //     let dataUser = await login(email,password);

    //     if(!dataUser) return res.status(401).json({message: "Sai emai hoặc mật khẩu"});


    //     if(dataUser.is_lock) return res.status(403).json({message: "Tài khoản đã bị khóa"});

    //     return res.status(200).json({
    //         message: "Đăng nhập thành công",
    //         data: dataUser
    //     });
    // }
    // catch(err){
    //     return res.status(404).json({
    //         message: "Lỗi không tìm thấy người dùng",
    //         error: err.message
    //     });
    // }

    

    // Dùng để test trên EJS


    if(!dataUser) return res.render('login',{error: "Sai emai hoặc mật khẩu"});


    if(dataUser.is_lock) return res.render('login',{error: "Tài khoản đã bị khóa"});

    if(dataUser.role == 'admin')
        return res.render('./admin/index',{
            users: await AllUsersData(),
            departments: await AllDepartmentsData(),
    });
    else if(dataUser.role == 'hr')
        return res.render('./hr/index', {user: dataUser});
    else if(dataUser.role == 'employee')
        return res.render('./employee/index', {user: dataUser});
    else 
        return res.render('NotFound');
}

 

const getAllUsers = async (req,res)=>{

    res.status(200).json(await AllUsersData());
}

const getUserById = async (req,res) =>{
    const userId = req.params.id;
    let data = await UserByIdData(userId);

    return res.status(200).json({data});
}

const createUser = async(req,res)=>{

    //các thuộc tính (body.[thuộc tính]) là thuộc tính lấy trực tiếp từ giao diện
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const role = req.body.role;

    //test trực tiếp trên trình duyệt
    // if(name==''||email=='' || password==''||phone==''|| role==''){
    //     res.send('Vui lòng nhập đầy đủ thông tin');
    // }


    //API
    // if(name==''||email=='' || password==''||phone==''|| role==''){
    //     return res.status(400).json({
    //         message: "Vui lòng nhập đầy đủ thông tin"
    //     })
    // }
    
    // try{
    //     let data = await CreateUser(name,email,password,phone,role);

    //     return res.status(201).json({
    //         message:"Tạo user thành công",
    //         data
    //     });
    // }
    // catch(err){
    //     return res.status(500).json({
    //         message:"Lỗi server nội bộ",
    //         error: err.message
    //     })
    // }


    //EJS TEST


    let data = await CreateUser(name,email,password,phone,role);

    if(data.affectedRows > 0){
        console.log('Tài khoản được thêm: ' , data.results);
        res.render('./admin/index',{users: await getAllUsers()});
    }

}

const editUser = async(req,res)=>{
    const uid = req.body.id;
 
    //các thuộc tính (body.[thuộc tính]) là thuộc tính lấy trực tiếp từ giao diện    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const role = req.body.role;

    //EJS TEST
    if(data.affectedRows > 0){
        res.render('./admin/index',{users: await getAllUsers()});
    }


    //API
    // try{
    //     let data = await UpdateUser(uid,name,email,password,phone, role);

    //     return res.status(200).json({
    //         message:"Cập nhật thành công",
    //         data
    //     });
    // }
    // catch(err){
    //     return res.status(500).json({
    //         message:"Lỗi server nội bộ",
    //         error: err.message
    //     })
    // }
}

const deleteUser = async(req,res)=>{
    const uid = req.params.id;
  
    //API
    // try{
    //     let data = await  DeleteUser(uid);

    //     console.log('Đã xóa thành công 1 user');

    //     return res.status(200).json({
    //         message:"Xoá thành công",
    //         data
    //     });
        
    // }
    // catch(err){
    //     return res.status(500).json({
    //         message:"Lỗi server nội bộ",
    //         error: err.message
    //     })
    // }

    //EJS TEST
    res.render('./admin/index',{users: await AllUsersData()});
}



const lockUser = async (req,res)=>{
    const uid = req.params.id;

    //các thuộc tính (body.[thuộc tính]) là thuộc tính lấy trực tiếp từ giao diện
    const isLock = parseInt(req.body.is_lock);
    LockUser(uid,isLock);
    //EJS test
    return res.render('./admin/index',{users: await AllUsersData()});

    //API
    // try{
    //     let data = await LockUser(uid,isLock);
    //     return res.status(200).json({
    //         message:"Đã cập nhật trạng thái của khoá (lock)",
    //         data
    //     });
    // }
    // catch(err){
    //     return res.status(500).json({
    //         message:"Lỗi máy chủ nội bộ",
    //         error: err.message
    //     })
    // }
}

const getAllDepartments = async(req,res)=>{
    let data = await AllDepartmentsData();

    //API
    return res.status(200).json({data}) ;
}

const getDepartmentById = async(req,res)=>{

    const depart_id = req.params.id;

    let data = await DepartmentByIdData(depart_id);

    //API
    return res.status(200).json({data});
}

const createDepartment = async(req,res)=>{

    //các thuộc tính (body.[thuộc tính]) là thuộc tính lấy trực tiếp từ giao diện    
    const Department_Name = req.body.department_name;
    

    //API

    // if(Department_Name == '')
    //     return res.status(400).json({message: "Vui lòng nhập đầy đủ thông tin"});

    // try{
    //     let data = await CreateDepartment(Department_Name);

    //     return res.status(201).json({
    //         message:"Đã thêm phòng ban",
    //         data
    //     })
    // }
    // catch(err){

    //     return res.status(500).json({
    //         message:"Lỗi máy chủ nội bộ",
    //         error: err.message
    //     })
    // }


    //EJS


    let data = await CreateDepartment(Department_Name);
    if(data.affectedRows > 0)
        res.render('./admin/index',{departments: await AllDepartmentsData});
}

const deleteDepartment = async(req,res)=>{
    const depart_id = req.params.id;

    //API
    // try{
    //     let data = await DeleteDepartment(depart_id);

    //     return res.status(200).json({
    //         message:"Xoá phòng ban thành công",
    //         data
    //     });
        
    // }
    // catch(err){
    //     return res.status(500).json({
    //         message:"Lỗi server nội bộ",
    //         error: err.message
    //     })
    // }

    let data = await DeleteDepartment(depart_id);

    res.render('./admin/index',{departments: await AllDepartmentsData()});

}

const editDepartment = async(req,res)=>{

    const depart_id = req.params.id;

    //các thuộc tính (body.[thuộc tính]) là thuộc tính lấy trực tiếp từ giao diện
    const Department_Name = req.body.department_name;
    const Manager_Id = req.body.manager_id;

    // try{
    //     let data = await EditDepartment(depart_id,Department_Name,Manager_Id);

    //      return res.status(200).json({
    //         message:"Cập nhật phòng ban thành công",
    //         data
    //     });
    // }
    // catch(err){
    //     return res.status(500).json({
    //         message:"Lỗi server nội bộ",
    //         error: err.message
    //     })
    // }

    let data = await EditDepartment(depart_id,Department_Name,Manager_Id);
    if(data.affectedRows > 0)
    res.render('./admin/index',{departments: await AllDepartmentsData()});
}


module.exports = {
    getAllUsers,
    getUserById,
    HomePage,
    LoginPage,
    LoginHandle,
    Logout,

    createUserPage,
    createUser,

    editUserPage,
    editUser,

    deleteUser,

    lockUser,

    getAllDepartments,
    getDepartmentById,

    createDepartmentPage,
    createDepartment,

    deleteDepartment,

    editDepartmentPage,
    editDepartment
}