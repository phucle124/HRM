const connection = require('../config/db');

const {getAllUsers ,getUserById, CreateUser, UpdateUser, DeleteUser} = require('../services/CRUDService')

//APIs
const AllUsersData = async (req,res)=>{

    res.json(await getAllUsers());
}

const UserByIdData = async (req,res) =>{
    let userId = req.params.id;
    res.json(await getUserById(userId));
}


//EJS Pages
const HomePage = (req,res)=>{

    res.render('home');

}

const LoginPage = (req,res)=>{
    res.render('login');
}

const LoginHandle = async (req,res) =>{
    const { email, password } = req.body;
    
    const [results,fields] = await connection.query(`
        SELECT id, name, role FROM users WHERE email = ? AND password = ?    
    `,[email, password]);

    //Dùng cho API
    // if(results.length > 0){
    //     return res.json({user : results[0]});
    // }

    //Dùng để test trên EJS
    if(results.length > 0){
        if(results[0].role == 'admin')
            res.render('./admin/index',{users: await getAllUsers()});
        else if(results[0].role == 'hr')
            res.render('./hr/index');
        else if(results[0].role == 'employee')
            res.render('./employee/index');
        else 
            res.render('NotFound');
    }
    else res.render('NotFound');
}

const createUser = async(req,res)=>{

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const role = req.body.role;


    if(name==''||email=='' || password==''||phone==''|| role==''){
        res.send('Vui lòng nhập đầy đủ thông tin');
    }

    let data = await CreateUser(name,email,password,phone,role);

    if(data.affectedRows > 0){
        console.log('Tài khoản được thêm: ' , data.results);
        res.redirect('/');
    }
    res.send('Khong the tao tai khoan'); 
}

const editUser = async(req,res)=>{
    const id = req.body.id;
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const role = req.body.role;

    let data = await UpdateUser(id,name,email,password,phone, role);

    if(data.affectedRows > 0){
        res.redirect('/');
    }

    res.send('Cập nhật thất bại');
}

const deleteUser = async(req,res)=>{
    const id = req.params.id;

    DeleteUser(id);
  
    console.log('Đã xóa thành công 1 user');
    res.redirect('/');
}

const createPage = (req,res)=>{
    res.render('./admin/createUser');
}

const editPage = async (req,res)=>{
    let uid = req.params.id;

    let data = await getUserById(uid)

    res.render('./admin/editUser',{userEdit: data[0]});
}

module.exports = {
    AllUsersData,
    UserByIdData,
    HomePage,
    LoginPage,
    LoginHandle,

    createPage,
    createUser,

    editPage,
    editUser,

    deleteUser,
}