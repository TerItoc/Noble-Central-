var config = require("./dbconfig");
const sql = require("mssql");

var pool; 

//SQL Injection protection en otro archivo

async function startConnection(){
    pool = await sql.connect(config);
}

async function getQuery(query){
    try{
        let res = await pool.request().query(query);
        return res;
    }
    catch(error){
        console.log("Error en:", query);
        return error;
    }
}

async function postQuery(query){
    try{
        await pool.query(query);
    }
    catch(error){
        console.log("Error en:", query);
    }
}

async function ifTeam(){

    let res = await getQuery(
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

function getRelacionID(relacion){
    switch(relacion){
        case "Peer to Peer":
            return 0;
        
        case "Lider a Equipo":
            return 1;

        case "Equipo a Lider":
            return 2;
    }
}

async function deleteEvaluation(empA,relacion,empB){
    
    let relacionID = getRelacionID(relacion);

    let idEmpA = null;
    await getEmployeeIdByName(empA).then((res) => {idEmpA = res});
    let idEmpB = null;
    await getEmployeeIdByName(empB).then((res) => {idEmpB = res});

    //console.log(idEmpA,relacionID,idEmpB);
    var query;

    switch(relacionID){
        case 0:
            query = `
                DELETE FROM EvaluaA WHERE (EmpleadoA = ${idEmpA} AND TipoEvaluacion = 0 AND EmpleadoB = ${idEmpB}) OR (EmpleadoA = ${idEmpB} AND TipoEvaluacion = 0 AND EmpleadoB = ${idEmpA});
            `
            break;

        case 1:
            query = `
                DELETE FROM EvaluaA WHERE (EmpleadoA = ${idEmpA} AND TipoEvaluacion = 1 AND EmpleadoB = ${idEmpB}) OR (EmpleadoA = ${idEmpB} AND TipoEvaluacion = 2 AND EmpleadoB = ${idEmpA});
            `
            break;


        case 2:
            query = `
                DELETE FROM EvaluaA WHERE (EmpleadoA = ${idEmpA} AND TipoEvaluacion = 2 AND EmpleadoB = ${idEmpB}) OR (EmpleadoA = ${idEmpB} AND TipoEvaluacion = 1 AND EmpleadoB = ${idEmpA});
            `
            break;

        default:
            -1
    }

    console.log("Deleted Evaluation" ,empA,relacion,empB, "y su viceversa");
    await postQuery(query);

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

    let orphans = await getQuery(`
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
function processTeams(recordset){
    let teams = {};

    for (let i = 0; i < recordset.length; i++) {
        let row = recordset[i];

        let relation = {NombreEvaluador: row.Nombre, TipoRelacion: row.EvaluacionNombre, estatus : row.estatus};

        if(teams[row.nombre]){
            teams[row.nombre].push(relation);
        }
        else{
            teams[row.nombre] = [relation];
        }
        
    }

    //console.log(teams);
    let equipos = [];

    for(const [key, value] of Object.entries(teams)){
        let newEntry = {}
        newEntry.nombre = key;
        newEntry.evaluadores = value;
        equipos.push(newEntry);
    }

    return {equipos:equipos};

}

async function getTeams(){

    let teams = await getQuery(`
        SELECT DISTINCT EmpA.nombre, EvaluacionNombre, EmpB.Nombre, estatus from EvaluaA
        JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID
        JOIN Empleado EmpB ON EvaluaA.EmpleadoB  = EmpB.EmpleadoID
        JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
    `)

    //console.log(processTeams(teams.recordset));
    return processTeams(teams.recordset);

}

function turnSQLtoJsonEmpIds(sqlRes){
    let res = {};
    
    for (let i = 0; i < sqlRes.length; i++) {
        let row = sqlRes[i];
        res[row[mn.sqlColumnaEmpleadoNombre]] = row[mn.sqlColumnaEmpleadoID]
    }
    return res;
}

async function addEvaluation(empA,TipoRelacion,empB){
    let relacionID = getRelacionID(TipoRelacion);

    let idEmpA = null;
    await getEmployeeIdByName(empA).then((res) => {idEmpA = res});
    let idEmpB = null;
    await getEmployeeIdByName(empB).then((res) => {idEmpB = res});

    //console.log(idEmpA,relacionID,idEmpB);
    var query;

    switch(relacionID){
        case 0:
            query = `
                INSERT INTO EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) Values (${idEmpA},0,${idEmpB},0),(${idEmpB},0,${idEmpA},0);
            `
            break;

        case 1:
            query = `
                INSERT INTO EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) Values (${idEmpA},1,${idEmpB},0),(${idEmpB},2,${idEmpA},0);
            `
            break;


        case 2:
            query = `
                INSERT INTO EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) Values (${idEmpA},2,${idEmpB},0),(${idEmpB},1,${idEmpA},0);
            `
            break;

        default:
            -1
    }

    console.log("Added Evaluation" ,empA,idEmpA,relacionID,empB,idEmpB, "y su viceversa");
    await postQuery(query);

}

async function getEmployeeIDs(){
    let res = await getQuery("SELECT * FROM Empleado");
    return turnSQLtoJsonEmpIds(res.recordset);
}

async function getEmployees(){
    let employees = await getQuery("SELECT Nombre FROM Empleado");
    //console.log(employees);
    let res = employees.recordset.map(x=> x.Nombre);
    //Quita el primer elemento "EmpleadoNoRegistrado"
    res.shift()
    return res;
}

async function getEmployeeNames(){
    let employees = await getQuery("SELECT Nombre FROM Empleado")
    return employees.recordset;
}

function term(str, char) {
    var xStr = str.substring(0, str.length - 1);
    return xStr + char;
}

async function postEmployees(arrEmpleados){
    let sqlQuery = `
        insert into empleado (nombre) values 
    `;

    let currQuery = ``;
    let rowCounter = 0;

    for(var i = 0; i<arrEmpleados.length;i++){
        nombre = arrEmpleados[i].replace("'", "");
        
        if(nombre == null){
            continue;
        }

        //correo = nombre.toString()+"@hotmail.com";
        //console.log(nombre,correo);

        currQuery = currQuery + `('${nombre}'),`;
        rowCounter++;

        if(rowCounter > 990){
            //console.log(term((sqlQuery + currQuery),';'))
            await postQuery(term((sqlQuery + currQuery),';'));
            rowCounter = 0;
            currQuery = ``;
        }
    };

    await postQuery(term((sqlQuery + currQuery),';'));
    //console.log(term((sqlQuery + currQuery),';'));
    console.log("Inserted Employees");


    await postQuery(`
        WITH cte AS (
            SELECT 
                EmpleadoID,
                Nombre, 
                Correo,
                ROW_NUMBER() OVER (
                    PARTITION BY 
                        Nombre
                    ORDER BY 
                        Nombre
                ) row_num
            FROM 
                Empleado
        )
        DELETE FROM cte
        WHERE row_num > 1;
    `)

    console.log("Deleted Duplicates");

}




async function getEmployeeTeamByName(employeeName){
    try{
        
        let res = await getQuery(`select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
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
        
        let res = await getQuery(`
            select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
            JOIN Empleado ON EvaluaA.EmpleadoB  = Empleado.EmpleadoID
            JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
            where EmpleadoA = ${employeeID}
        `);

        return res.recordset;
    }
    catch(error){
        console.log(error);
    }
}

async function getEmployeeIdByName(nameEmployee){
    try{
        let res = await getQuery(`select empleadoid from empleado where nombre = '${nameEmployee}'`);

        return res.recordset[0].empleadoid;
    }
    catch(error){
        //If we cant find it we will register it as "EmpleadoNoRegistrado"
        return 1
    }
}

async function getEmployeeNameById(empleadoid){
    let res = await getQuery(`select nombre from empleado where empleadoid = '${empleadoid}'`);
    return res.recordset[0].empleadoid;
}

async function getProjectByID(ID){
    let res = await getQuery(`select Nombre from Proyecto where ProyectoID = ${ID}`);
    return res.recordset[0].Nombre;
}

async function getProjectIDByName(name){
    let res = await getQuery(`select ProyectoID from Proyecto where Nombre = '${name}'`);
    return res.recordset[0].ProyectoID;
}

async function postProjects(matrixProyectos){
    
    try{
        empIds = null;
        await getEmployeeIDs().then((res) => {empIds = res;});

        let sqlQuery = `
            insert into proyecto (nombre,Lider) values
        `
        let currQuery = ``;
        let rowCounter = 0;

        for(var i = 0; i<matrixProyectos.length;i++){

            let nombre = matrixProyectos[i][0].replace("'", "");

            let liderid = empIds[matrixProyectos[i][1]];
            
            if(!liderid){
                liderid = 1;
            }
            
            //console.log(nombre,matrixProyectos[i][1],liderid);
    
            currQuery = currQuery + `('${nombre}',${liderid}),`;
            rowCounter++;

            if(rowCounter > 990){
                console.log(term((sqlQuery + currQuery),';'))
                await postQuery(term((sqlQuery + currQuery),';'));
                rowCounter = 0;
                currQuery = ``;
            }
        };

        await postQuery(term((sqlQuery + currQuery),';'));
        console.log("Inserted Projects");
    }
    catch(error){
        console.log("error",nombre,liderid);
    }
}

async function getProjects(){

}

async function postHorasPorEmpleado(matrix){

    empIds = null;
    await getEmployeeIDs().then((res) => {empIds = res;});

    let sqlQuery = `
        insert into trabaja_en(ProyectoID,EmpleadoID,Horas) values
    `
    let currQuery = ``;
    let rowCounter = 0;

    for(var i = 0; i<matrix.length;i++){
        const row = matrix[i];
        //console.log(row);

        let proyectoid = null;
        empleadoid = empIds[row[1].replace("'", "")]

        if(!empleadoid){
            empleadoid = 1;
        }
        
        await getProjectIDByName(row[0].replace("'", "")).then((result) => {proyectoid = result});

        let horas = row[2];

        //console.log(proyectoid,empleadoid,horas);

        currQuery = currQuery + `(${proyectoid},${empleadoid},${horas}),`;
        rowCounter++;

        if(rowCounter > 990){
            console.log(term((sqlQuery + currQuery),';'))
            await postQuery(term((sqlQuery + currQuery),';'));
            rowCounter = 0;
            currQuery = ``;
        }
    
    };

    await postQuery(term((sqlQuery + currQuery),';'));
    console.log("Inserted Employee Hours");
    
}


async function getEntries(){

    let entries = await getQuery(`
        SELECT Empleado.Nombre, Proyecto.Nombre, Horas
        FROM Trabaja_En
        JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
        JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
    `)

    return entries.recordset;

}

async function getEmployeesThatWorkedOnProject(projectname,hours){

    let entries = await getQuery(`
        SELECT Empleado.Nombre,Proyecto.Nombre,Horas
        FROM Trabaja_En
        JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
        JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
        WHERE Proyecto.Nombre = '${projectname}' and Horas > ${hours}
    `)

    return entries.recordset;

}


async function getProjectEmployeeWorkedOn(employeeName,hours){

    let entries = await getQuery(`
        SELECT Proyecto.Nombre
        FROM Trabaja_En
        JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
        JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
        WHERE Empleado.Nombre = '${employeeName}' and Horas > ${hours}
    `)

    return entries.recordset;

}

//getEmployees().then( res => {console.log(res)});

async function getLeader(projectName){

    let entries = await getQuery(`
        SELECT Empleado.Nombre
        FROM Proyecto 
            FROM Proyecto 
        FROM Proyecto 
        JOIN Empleado ON Proyecto.Lider = Empleado.EmpleadoID
        WHERE Proyecto.Nombre = '${projectName}'
    `)

    return entries.recordset;
}

async function deleteCurrentTeams(){

    await postQuery(`
        delete EvaluaA
        delete Trabaja_En
        delete Proyecto
        delete Reportes
        DBCC CHECKIDENT ('Proyecto', RESEED, 0);
        delete Empleado
        DBCC CHECKIDENT ('Empleado', RESEED, 0);
        DBCC CHECKIDENT ('EvaluaA', RESEED, 0); 
        insert into Empleado(Nombre,Correo) values('EmpleadoNoRegistrado','N/A')`
    );

    console.log("Deleted current teams")
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
    addEvaluation: addEvaluation,
    deleteCurrentTeams: deleteCurrentTeams,
    startConnection: startConnection,
    getEmployeeIDs: getEmployeeIDs,
    ifTeam: ifTeam,
}
