const connection = require('../config/db');

const {getAllUsers ,getUserById} = require('../services/CRUDService')

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
            res.render('./admin/index');
        else if(results[0].role == 'hr')
            res.render('./hr/index');
        else if(results[0].role == 'employee')
            res.render('./employee/index');
        else 
            res.render('NotFound');
    }
    else res.render('NotFound');
}





module.exports = {
    AllUsersData,
    UserByIdData,
    HomePage,
    LoginPage,
    LoginHandle,

}