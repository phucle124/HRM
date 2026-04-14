
const {login} = require('../services/AuthenticateService');


const {AllUsersData ,UserByIdData, CreateUser, UpdateUser, DeleteUser, LockUser, AllDepartmentsData, DepartmentByIdData, EditDepartment, DeleteDepartment, CreateDepartment, EmployeeByIdData, Employees_ByDepartmentId, Manager_BydepartmentId, Manager_ByDepartmentId, Assign_Manager, AllAttendancesData} = require('../services/CRUDService')



const getAllUsers = async (req,res)=>{

    res.status(200).json(await AllUsersData());
}

const getUserById = async (req,res) =>{
    const userId = req.params.id;
    let dataUser = await UserByIdData(userId);

    return res.status(200).json({data : dataUser});
}


//EJS Pages
const HomePage = (req,res)=>{

    res.render('home');
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

const admin_index = async (req,res)=>{
    res.render('./admin/index',{
        users: await AllUsersData(),
        departments: await AllDepartmentsData(),
    });
}

const Logout = (req,res)=>{
    //Luôn xoá các thuộc tính cũ ĐÃ LƯU
    res.locals = {};

    res.redirect('/');
}

//Handles
const LoginHandle = async (req,res) =>{
    
    const { email, password } = req.body;

    
    try{
        let dataUser = await login(email,password);

        if(!dataUser) return res.status(401).json({message: "Sai emai hoặc mật khẩu"});


        if(dataUser.is_lock) return res.status(403).json({message: "Tài khoản đã bị khóa"});

        // LƯU VÀO SESSION 
        req.session.user = {
            id: dataUser.id,
            name: dataUser.name,
            role: dataUser.role 
        };
        

        return res.status(200).json({
            message: "Đăng nhập thành công",
            data: req.session.user
        });

    }
    catch(err){
        return res.status(404).json({
            message: "Lỗi không tìm thấy người dùng",
            error: err.message
        });
    }

    

    // Dùng để test trên EJS

    // let dataUser = await login(email,password);
    // if(!dataUser) return res.render('login',{error: "Sai emai hoặc mật khẩu"});


    // if(dataUser.is_lock) return res.render('login',{error: "Tài khoản đã bị khóa"});

    // if(dataUser.role == 'admin')
    //    return res.redirect('/admin-index');
    // else if(dataUser.role == 'hr')
    //     return res.render('./hr/index', {user: dataUser});
    // else if(dataUser.role == 'employee')
    //     return res.render('./employee/index', {user: dataUser});
    // else 
    //     return res.render('NotFound');
}

const SessionContain = (req,res)=>{

    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    console.log("SESSION:", req.session);

    const id = req.session.user.id;
    const name = req.session.user.name;
    const role = req.session.user.role;

    

    return res.status(200).json({id,name,role});
} 


const createUser = async(req,res)=>{

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
    if(name==''||email=='' || password==''||phone==''|| role==''){
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin"
        })
    }
    
    try{
        let dataCreateUsr = await CreateUser(name,email,password,phone,role);

        return res.status(200).json({
            message:"Tạo user thành công",
            data: dataCreateUsr
        });
    }
    catch(err){
        return res.status(500).json({
            message:"Lỗi server nội bộ",
            error: err.message
        })
    }


    //EJS TEST

    //     console.log('Tài khoản được thêm: ' , data.results);
    //     res.redirect('/admin-index');

}

const editUser = async(req,res)=>{
    const id = req.body.id;
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const role = req.body.role;



    //EJS TEST
    // 
    //     res.redirect('/admin-index');
    // 


    //API
    try{
        let dataUpdtUsr = await UpdateUser(id,name,email,password,phone, role);

        return res.status(200).json({
            message:"Cập nhật thành công",
            data: dataUpdtUsr
        });
    }
    catch(err){
        return res.status(500).json({
            message:"Lỗi server nội bộ",
            error: err.message
        })
    }
}

const deleteUser = async(req,res)=>{
    const id = req.params.id;
  
    //API
    try{
        let dataDelUsr = await  DeleteUser(id);

        console.log('Đã xóa thành công 1 user');

        return res.status(200).json({
            message:"Xoá thành công",
            data: dataDelUsr
        });
        
    }
    catch(err){
        return res.status(500).json({
            message:"Lỗi server nội bộ",
            error: err.message
        })
    }

    //EJS TEST
    // res.redirect('/admin-index');
}



const lockUser = async (req,res)=>{
    const uid = req.params.id;
    const isLock = parseInt(req.body.isLock);

    //EJS test
    // await LockUser(uid,isLock);
    // res.redirect('/admin-index');

    //API
    try{
        let dataLockUsr = await LockUser(uid,isLock);
        return res.status(200).json({
            message:"Đã cập nhật trạng thái của khoá (lock)",
            data: dataLockUsr
        });
    }
    catch(err){
        return res.status(500).json({
            message:"Lỗi máy chủ nội bộ",
            error: err.message
        })
    }
}


const getAllDepartments = async(req,res)=>{
    let dataDept = await AllDepartmentsData();

    //API
    return res.status(200).json({data: dataDept}) ;
}

const getDepartmentById = async(req,res)=>{
    const departmentId = req.params.id;
    let dataDept = await DepartmentByIdData(departmentId);

    //API
    return res.status(200).json({data: dataDept});
}

const createDepartmentPage = (req,res)=>{
    res.render('./admin/createDepartment');
}

const createDepartment = async(req,res)=>{
    
    const department_Name = req.body.department_name.trim();  
    // const manager_Id = req.body.manager_id;
    const manager_Id = null;


    //EJS TEST
    // let data = await CreateDepartment(department_Name, manager_Id);

    // res.redirect('/admin-index');

    try {

        if (!department_Name) {
            return res.status(400).json({
                message: "Thiếu tên phòng ban"
            });
        }

        const data = await CreateDepartment(department_Name, manager_Id);

        return res.status(201).json({
            message: "Tạo phòng ban thành công",
            data
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
   
}

const editDepartmentPage = async (req,res)=>{

    const DepartmentId = req.params.id;

    let DepartmentById = await DepartmentByIdData(DepartmentId);

    let EmployeesBy_DepartmentId = await Employees_ByDepartmentId(DepartmentId);

    let CurrentManagerBy_DepartmentId = await Manager_ByDepartmentId(DepartmentId);


    res.render('./admin/editDepartment',{
        department_id: DepartmentId,
        departmentEdit: DepartmentById[0],
        employeesEdit: EmployeesBy_DepartmentId,
        currentManagerEdit: CurrentManagerBy_DepartmentId[0],
    });
}
    
const editDepartment = async(req,res)=>{
    
    const DepartmentId = req.params.id;
    
    const Department_Name = req.body.department_name;
    const managerId = req.body.manager_id;
       
    //EJS TEST
    // let data = await EditDepartment(DepartmentId,Department_Name,managerId);

    // res.redirect('/admin-index');

    try {

        const dataEditDept = await EditDepartment(DepartmentId, Department_Name, managerId);

        return res.status(200).json({
            message: "Cập nhật phòng ban thành công!",
            data: dataEditDept
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
    
}

const deleteDepartment = async(req,res)=>{
    const DepartmentId = req.params.id;

    //EJS TEST 
    // let data = await DeleteDepartment(DepartmentId);

    // res.redirect('/admin-index');

    try {
        const dataDelDept = await DeleteDepartment(DepartmentId);

        return res.status(200).json({
            message: "Đã xóa phòng ban",
            data: dataDelDept
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const getEmployeesByDepartment = async (req, res) => {
    try {
        let departmentId = req.params.id; // Lấy ID từ URL
        
        // Gọi hàm từ CRUDService
        let data = await Employees_ByDepartmentId(departmentId);
        
        return res.status(200).json({
            message: "Thành công",
            data: data
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


const assignManager = async(req,res)=>{
    const DepartmentId = req.params.departmentId;
    const EmployeeId = req.body.employeeId;

    try {
        const dataAssignManager = await Assign_Manager(DepartmentId,EmployeeId);

        return res.status(200).json({
            message: "Đã gán trưởng phòng thành công",
            data: dataAssignManager
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const getAllAttendances = async (req,res) =>{
    res.status(200).json(await AllAttendancesData());
};



module.exports = {
    getAllUsers,
    getUserById,
    HomePage,
    LoginPage,
    LoginHandle,
    Logout,

    SessionContain,

    admin_index,

    createUserPage,
    createUser,

    editUserPage,
    editUser,

    deleteUser,
    lockUser,

    getAllDepartments,
    getDepartmentById,
    getEmployeesByDepartment,
    getAllAttendances,

    createDepartmentPage,
    createDepartment,

    editDepartmentPage,
    editDepartment,

    deleteDepartment,

    assignManager

}
