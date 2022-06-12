const dsql = require('../services/sqlFunctions');
const xlConfig = require('../config/excelConfigTemplate');
const formatUtil = require('../services/formatting');

async function isAdmin(correo) {
  let q = await dsql.getQuery(`
          select COUNT(*) from Administradores where Correo = '${correo}'
      `);
  let res = q.recordset[0][""];

  if (res == 0) {
    return { isAdmin: "false" };
  } else {
    return { isAdmin: "true" };
  }
}

async function getEmployees() {
  let employees = await dsql.getQuery("SELECT Nombre FROM Empleado");
  //console.log(employees);
  let res = employees.recordset.map((x) => x.Nombre);
  //Quita el primer elemento "EmpleadoNoRegistrado"
  res.shift();
  return res;
}

async function getEmployeeNames() {
  let employees = await dsql.getQuery("SELECT Nombre FROM Empleado");
  return employees.recordset;
}

function turnSQLtoJsonEmpIds(sqlRes) {
  let res = {};

  for (let i = 0; i < sqlRes.length; i++) {
    let row = sqlRes[i];
    res[row[xlConfig.sqlColumnaEmpleadoNombre]] = row[xlConfig.sqlColumnaEmpleadoID];
  }
  return res;
}

async function getEmployeeIDs() {
  let res = await dsql.getQuery("SELECT * FROM Empleado");
  return turnSQLtoJsonEmpIds(res.recordset);
}

async function getEmployeeTeamByName(employeeName) {
  try {
    let res =
      await dsql.getQuery(`select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
          JOIN Empleado ON EvaluaA.EmpleadoB  = Empleado.EmpleadoID
          JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
          where EmpleadoA = (select EmpleadoID from Empleado where Nombre = '${employeeName}')`);

    return res.recordset;
  } catch (error) {
    console.log(error);
  }
}

async function getEmployeeTeamByID(employeeID) {
  try {
    let res = await dsql.getQuery(`
              select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
              JOIN Empleado ON EvaluaA.EmpleadoB  = Empleado.EmpleadoID
              JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
              where EmpleadoA = ${employeeID}
          `);

    return res.recordset;
  } catch (error) {
    console.log(error);
  }
}

async function getEmployeeIdByName(nameEmployee) {
  try {
    let res = await dsql.getQuery(
      `select empleadoid from empleado where nombre = '${nameEmployee}'`
    );

    return res.recordset[0].empleadoid;
  } catch (error) {
    //If we cant find it we will register it as "EmpleadoNoRegistrado"
    return 1;
  }
}

async function getEmployeeNameById(empleadoid) {
  let res = await dsql.getQuery(
    `select nombre from empleado where empleadoid = '${empleadoid}'`
  );
  return res.recordset[0].empleadoid;
}

async function getLeader(projectName) {
  let entries = await dsql.getQuery(`
          SELECT Empleado.Nombre
          FROM Proyecto 
              FROM Proyecto 
          FROM Proyecto 
          JOIN Empleado ON Proyecto.Lider = Empleado.EmpleadoID
          WHERE Proyecto.Nombre = '${projectName}'
      `);

  return entries.recordset;
}

async function postEmployees(arrEmpleados) {
    let sqlQuery = `
            insert into empleado (nombre) values 
        `;
  
    let currQuery = ``;
    let rowCounter = 0;
  
    for (var i = 0; i < arrEmpleados.length; i++) {
      nombre = arrEmpleados[i].replace("'", "");
  
      if (nombre == null) {
        continue;
      }
  
      //correo = nombre.toString()+"@hotmail.com";
      //console.log(nombre,correo);
  
      currQuery = currQuery + `('${nombre}'),`;
      rowCounter++;
  
      if (rowCounter > 990) {
        //console.log(term((sqlQuery + currQuery),';'))
        await dsql.postQuery(formatUtil.term(sqlQuery + currQuery, ";"));
        rowCounter = 0;
        currQuery = ``;
      }
    }
  
    await dsql.postQuery(formatUtil.term(sqlQuery + currQuery, ";"));
    //console.log(term((sqlQuery + currQuery),';'));
    console.log("Inserted Employees");
  
    await dsql.postQuery(`
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
        `);
  
    console.log("Deleted Duplicates");
  }

module.exports = {
  isAdmin:isAdmin,
  getEmployees:getEmployees,
  getEmployeeNames:getEmployeeNames,
  getEmployeeIDs:getEmployeeIDs,
  getEmployeeTeamByName:getEmployeeTeamByName,
  getEmployeeTeamByID:getEmployeeTeamByID,
  getEmployeeIdByName:getEmployeeIdByName,
  getEmployeeNameById:getEmployeeNameById,
  getLeader:getLeader,
  postEmployees:postEmployees,
}
