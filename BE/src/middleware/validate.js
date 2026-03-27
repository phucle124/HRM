const connection = require('../config/db');
const { DepartmentByIdData } = require('../services/CRUDService');

const validate_EditDepartment = async(req,res,next)=>{
    try{
        const DepartmentId = req.body.department_id;
        const DepartmentName =req.body.department_name.trim();

        if(DepartmentId == '' || DepartmentName == '') 
            // return res.status(400).send("Xác nhận: Thiếu <mã phòng ban> hoặc <tên phòng>");
            throw new Error("Xác nhận: Thiếu <mã phòng ban> hoặc <tên phòng>");

        let data = await DepartmentByIdData(DepartmentId);

        if(data.length === 0)
            //return res.status(404).send("Xác nhận: Phòng ban không tồn tại!");
            throw new Error("Xác nhận: Phòng ban không tồn tại!");

        const currentName = data[0].name;
        
        if(currentName.toLowerCase() != DepartmentName.toLowerCase()){
            const [results,fields] = await connection.query(`
                SELECT * FROM departments 
                WHERE name = ? 
            `,[DepartmentName]);

            if(results.length > 0) 
                // return res.status(1062).send("Xác nhận: Tên phòng đã tồn tại");
                throw new Error("Xác nhận: Tên phòng đã tồn tại");
        }

        next();

    }
    catch(err){
        next(err);
    }
};



module.exports  = {
    validate_EditDepartment,
   
}