const dsql = require('../services/sqlFunctions');
const empController = require('../controllers/empleadoController');
const projectController = require('../controllers/projectController');

async function postHorasPorEmpleado(matrix) {
  empIds = null;
  await empController.getEmployeeIDs().then((res) => {
    empIds = res;
  });

  projectIds = null;
  await projectController.getProjectIDs().then((res) => {
    projectIds = res;
  });

  let sqlQuery = `
          insert into trabaja_en(ProyectoID,EmpleadoID,Horas) values
      `;
  let currQuery = ``;
  let rowCounter = 0;

  for (var i = 0; i < matrix.length; i++) {
    const row = matrix[i];

    let nombreProyecto = row[0].replace("'", "");
    let proyectoid = projectIds[nombreProyecto].id;
    empleadoid = empIds[row[1].replace("'", "")];

    if (!empleadoid) {
      empleadoid = 1;
    }

    let horas = row[2];

    currQuery = currQuery + `(${proyectoid},${empleadoid},${horas}),`;
    rowCounter++;

    if (rowCounter > 990) {
      //console.log(term((sqlQuery + currQuery),';'))
      await dsql.postQuery(term(sqlQuery + currQuery, ";"));
      rowCounter = 0;
      currQuery = ``;
    }
  }
  await dsql.postQuery(term(sqlQuery + currQuery, ";"));
  console.log("Inserted Employee Hours");
}

async function getEntries() {
  let entries = await dsql.getQuery(`
          SELECT Empleado.Nombre, Proyecto.Nombre, Horas
          FROM Trabaja_En
          JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
          JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
      `);

  return entries.recordset;
}

async function getEmployeesThatWorkedOnProject(projectname, hours) {
  let entries = await dsql.getQuery(`
          SELECT Empleado.Nombre,Proyecto.Nombre,Horas
          FROM Trabaja_En
          JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
          JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
          WHERE Proyecto.Nombre = '${projectname}' and Horas > ${hours}
      `);

  return entries.recordset;
}

async function getProjectEmployeeWorkedOn(employeeName, hours) {
  let entries = await dsql.getQuery(`
          SELECT Proyecto.Nombre
          FROM Trabaja_En
          JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
          JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
          WHERE Empleado.Nombre = '${employeeName}' and Horas > ${hours}
      `);

  return entries.recordset;
}

module.exports = {
  postHorasPorEmpleado:postHorasPorEmpleado,
  getEntries:getEntries,
  getEmployeesThatWorkedOnProject:getEmployeesThatWorkedOnProject,
  getProjectEmployeeWorkedOn:getProjectEmployeeWorkedOn,
}
