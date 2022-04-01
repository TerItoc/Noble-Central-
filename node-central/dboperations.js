var config = require("./dbconfig");
const sql = require("mssql");


async function getEmployees(){
    try{
        let pool = await sql.connect(config);
        let employees = await pool.request().query("SELECT * FROM Empleado")
        return employees.recordset;
    }
    catch(error){
        console.log(error);
    }
}

async function postEmployees(arrEmpleados){
    try{
        let pool = await sql.connect(config);

        //DBCC CHECKIDENT ('[TestTable]', RESEED, 0);GO
        //Used for resetting IDENTITY
        for(var i = 0; i<arrEmpleados.length;i++){
            nombre = arrEmpleados[i];
            correo = nombre.toString()+"@hotmail.com";
            console.log(nombre,correo);
            await pool.query(`
            
            If Not Exists(select * from empleado where nombre='${nombre}' or correo ='${correo}')
            Begin
            insert into empleado (nombre,correo) values ('${nombre}','${correo}')
            End
            `);
        };
        console.log("Inserted Employees");
    }
    catch(error){
        console.log(error);
    }
}

async function getEmployeeIdByName(nameEmployee){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select empleadoid from empleado where nombre = '${nameEmployee}'`);

        return res.recordset[0].empleadoid;
    }
    catch(error){
        //If we cant find it we will register it and then return the ID
        try{
            let pool = await sql.connect(config);
            
            await pool.query(`insert into empleado (nombre) values ('${nameEmployee}')`);
            console.log("Tenemos un desconocimodo",nameEmployee);

            let res = await pool.request().query(`select empleadoid from empleado where nombre = '${nameEmployee}'`);
            return res.recordset[0].empleadoid;
        }
        catch(error){
            return error
        }
    }
}

async function getProjectByID(ID){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select Nombre from Proyecto where ProyectoID = ${ID}`);

        return res.recordset[0].Nombre;
    }
    catch(error){
        console.log(error)
    }
}

async function getProjectIDByName(name){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select ProyectoID from Proyecto where Nombre = '${name}'`);

        return res.recordset[0].ProyectoID;
    }
    catch(error){
        console.log(error)
    }
}

async function postProjects(matrixProyectos){
    try{
        let pool = await sql.connect(config);

        //DBCC CHECKIDENT ('[TestTable]', RESEED, 0);GO
        //Used for resetting IDENTITY
        for(var i = 0; i<matrixProyectos.length;i++){

            let nombre = matrixProyectos[i][0].replace("'", "");
            let liderid = null;
            
            await getEmployeeIdByName(matrixProyectos[i][1]).then((result) => {liderid = result});
            console.log(nombre,matrixProyectos[i][1],liderid);
            
            
            await pool.query(`
            
            If Not Exists(select * from proyecto where nombre='${nombre}' and Lider =${liderid})
            Begin
            insert into proyecto (nombre,Lider) values ('${nombre}',${liderid})
            End
            `);
        
        };
        console.log("Inserted Projects");
    }
    catch(error){
        console.log(error);
    }
}

//getProjectIDByName('ACP - Coursetune').then(result => {console.log(result)}) 

module.exports = {
    getEmployees : getEmployees,
    postEmployees: postEmployees,
    getEmployeeIdByName: getEmployeeIdByName,
    postProjects: postProjects,
}
