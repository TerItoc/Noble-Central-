var config = require("./dbconfig");
const sql = require("mssql");


async function ifTeam(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(
        `
        SELECT CASE WHEN EXISTS (
            SELECT *
            FROM EvaluaA
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END
        `)
        return res.recordset[0][''];
    } 
    catch(error){
        console.log(error);
    }
}

function getRelacionID(relacion){
    if(relacion == "Peer to Peer"){
        return 0;
    }
    
    if(relacion == "Lider a Equipo"){
        return 1;
    }

    if(relacion == "Equipo a Lider"){
        return 2;
    }
}

async function deleteEvaluation(empA,relacion,empB){
    try{

        let relacionID = getRelacionID(relacion);

        let idEmpA = null;
        getEmployeeIdByName(empA).then((res) => {idEmpA = res});
        let idEmpB = null;
        getEmployeeIdByName(empB).then((res) => {idEmpB = res});


        let pool = await sql.connect(config);
        await pool.request().query(`
            DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';
        `)
        console.log("Deleted");
    } 
    catch(error){
        console.log(error);
    }
}

function processOrphans(recordset){
    huerfanos = []

    //console.log(recordset);
    for (let i = 0; i < recordset.length; i++) {
        let row = recordset[i];

        let huerfano = {NombreHuerfano: row.Nombre[0], ProyectoDondeTrabajo: row.Nombre[1]};
        huerfanos.push(huerfano);
        
    }

    return {huerfanos: huerfanos};

}
async function getOrphans(){
    try{
        let pool = await sql.connect(config);
        let orphans = await pool.request().query(`
            SELECT Empleado.Nombre, Proyecto.Nombre
            FROM Trabaja_En
            JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
            JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
            where Empleado.Nombre in (SELECT distinct nombre FROM Empleado
            WHERE nombre NOT in (SELECT DISTINCT EmpA.Nombre from EvaluaA
                                    JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID))
        `)
        //console.log(processTeams(teams.recordset));
        return processOrphans(orphans.recordset);
    } 
    catch(error){
        console.log(error);
    }
}
function processTeams(recordset){
    teams = {};

    for (let i = 0; i < recordset.length; i++) {
        let row = recordset[i];

        let relation = {NombreEvaluador: row.Nombre, TipoRelacion: row.EvaluacionNombre};

        if(teams[row.nombre]){
            teams[row.nombre].push(relation);
        }
        else{
            teams[row.nombre] = [relation];
        }
        
    }

    //console.log(teams);
    equipos = []
    for(const [key, value] of Object.entries(teams)){
        let newEntry = {}
        newEntry.nombre = key;
        newEntry.evaluadores = value;
        equipos.push(newEntry);
    }

    return {equipos:equipos};

}

async function getTeams(){
    try{
        let pool = await sql.connect(config);
        let teams = await pool.request().query(`
            SELECT DISTINCT EmpA.nombre, EvaluacionNombre, EmpB.Nombre from EvaluaA
            JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID
            JOIN Empleado EmpB ON EvaluaA.EmpleadoB  = EmpB.EmpleadoID
            JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
        `)
        //console.log(processTeams(teams.recordset));
        return processTeams(teams.recordset);
    } 
    catch(error){
        console.log(error);
    }
}


//getTeams().then((res) => {console.log(res)})


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
            //console.log(nombre,correo);
            await pool.query(`
            insert into empleado (nombre,correo) values ('${nombre}','${correo}')
            `);
            console.log(nombre);
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

async function deleteCurrentTeams(){
    try{
        let pool = await sql.connect(config);

        await pool.request().query(`
        delete EvaluaA
        delete Trabaja_En
        delete Proyecto
        DBCC CHECKIDENT ('Proyecto', RESEED, 0);
        delete Empleado
        DBCC CHECKIDENT ('Empleado', RESEED, 0);
        insert into Empleado(Nombre,Correo) values('EmpleadoNoRegistrado','N/A')`);

        console.log("Deleted current teams")
    }
    catch(error){
        console.log(error);
    }

}




//getEmployeeTeamByName('Alfredo Martinez').then(result => {console.log(result)}) 

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
    getTeams : getTeams,
    getOrphans: getOrphans,
    deleteEvaluation: deleteEvaluation,
    deleteCurrentTeams: deleteCurrentTeams,
}
