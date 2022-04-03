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

async function getEmployeeNames(){
    try{
        let pool = await sql.connect(config);
        let employees = await pool.request().query("SELECT Nombre FROM Empleado")
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
            nombre = arrEmpleados[i].replace("'", "");
            if(nombre == null){
                continue;
            }
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

async function postQuery(query){
    try{
        let pool = await sql.connect(config);
        await pool.query(query);
        console.log("Did query")
    }
    catch(error){
        console.log(error);
    }
}



async function getEmployeeTeamByName(employeeName){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
        JOIN Empleado ON EvaluaA.EmpleadoB  = Empleado.EmpleadoID
        JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
        where EmpleadoA = (select EmpleadoID from Empleado where Nombre = '${employeeName}')`);

        return res.recordset;
    }
    catch(error){
        console.log(error);
    }
}

async function getEmployeeTeamByID(employeeID){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
        JOIN Empleado ON EvaluaA.EmpleadoB  = Empleado.EmpleadoID
        JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
        where EmpleadoA = ${employeeID}`);

        return res.recordset;
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

async function getEmployeeNameById(empleadoid){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(`select nombre from empleado where empleadoid = '${empleadoid}'`);

        return res.recordset[0].empleadoid;
    }
    catch(error){
        console.log(error);
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

async function postHorasPorEmpleado(matrix){
    try{
        let pool = await sql.connect(config);

        //DBCC CHECKIDENT ('[TestTable]', RESEED, 0);GO
        //Used for resetting IDENTITY
        for(var i = 0; i<matrix.length;i++){
            const row = matrix[i];
            console.log(row);

            let proyectoid = null;
            let empleadoid = null;
            
            await getProjectIDByName(row[0].replace("'", "")).then((result) => {proyectoid = result});
            await getEmployeeIdByName(row[1].replace("'", "")).then((result) => {empleadoid = result});
            
            let horas = row[2];

            console.log(proyectoid,empleadoid,horas);
            
            await pool.query(`
                If Not Exists(select * from Trabaja_En where ProyectoID= ${proyectoid} and EmpleadoID =${empleadoid} and Horas = ${horas})
                Begin
                insert into trabaja_en(ProyectoID,EmpleadoID,Horas) values (${proyectoid},${empleadoid},${horas})
                End
            `);
        
        };
        console.log("Inserted EmployeeHours");
    }
    catch(error){
        console.log(error);
    }
    
}


async function getEntries(){
    try{
        let pool = await sql.connect(config);

        let entries = await pool.request().query(`
            SELECT Empleado.Nombre, Proyecto.Nombre, Horas
            FROM Trabaja_En
            JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
            JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
        `)

        return entries.recordset;
    }
    catch(error){
        console.log(error);
    }
}

async function getEmployeesThatWorkedOnProject(projectname,hours){
    try{
        let pool = await sql.connect(config);

        let entries = await pool.request().query(`
            SELECT Empleado.Nombre,Proyecto.Nombre,Horas
            FROM Trabaja_En
            JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
            JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
            WHERE Proyecto.Nombre = '${projectname}' and Horas > ${hours}
        `)

        return entries.recordset;
    }
    catch(error){
        console.log(error);
    }

}


async function getProjectEmployeeWorkedOn(employeeName,hours){
    try{
        let pool = await sql.connect(config);

        let entries = await pool.request().query(`
            SELECT Proyecto.Nombre
            FROM Trabaja_En
            JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
            JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
            WHERE Empleado.Nombre = '${employeeName}' and Horas > ${hours}
        `)

        return entries.recordset;
    }
    catch(error){
        console.log(error);
    }

}

async function getLeader(projectName){
    try{
        let pool = await sql.connect(config);

        let entries = await pool.request().query(`
            SELECT Empleado.Nombre
            FROM Proyecto 
            JOIN Empleado ON Proyecto.Lider = Empleado.EmpleadoID
            WHERE Proyecto.Nombre = '${projectName}'
        `)

        return entries.recordset;
    }
    catch(error){
        console.log(error);
    }

}


getEmployeeTeamByName('Alfredo Martinez').then(result => {console.log(result)}) 

module.exports = {
    getEmployees : getEmployees,
    postEmployees: postEmployees,
    getEmployeeIdByName: getEmployeeIdByName,
    postProjects: postProjects,
    getProjectIDByName : getProjectIDByName,
    getProjectByID : getProjectByID,
    getEmployeeNameById: getEmployeeNameById,
    postHorasPorEmpleado: postHorasPorEmpleado,
    getEmployeesThatWorkedOnProject: getEmployeesThatWorkedOnProject,
    getLeader: getLeader,
    getEntries: getEntries,
    getProjectEmployeeWorkedOn: getProjectEmployeeWorkedOn,
    getEmployeeNames: getEmployeeNames,
    postQuery: postQuery,
    getEmployeeTeamByName: getEmployeeTeamByName,
    getEmployeeTeamByID: getEmployeeTeamByID,
}
