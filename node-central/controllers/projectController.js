const dsql = require('../services/sqlFunctions');
const empController = require('../controllers/empleadoController');
const formatUtil = require('../services/formatting');


async function getProjectByID(ID) {
  let res = await dsql.getQuery(
    `select Nombre from Proyecto where ProyectoID = ${ID}`
  );
  return res.recordset[0].Nombre;
}

async function getProjectIDByName(name) {
  let res = await dsql.getQuery(
    `select ProyectoID from Proyecto where Nombre = '${name}'`
  );
  return res.recordset[0].ProyectoID;
}

async function postProjects(matrixProyectos) {
  try {
    empIds = null;
    await empController.getEmployeeIDs().then((res) => {
      empIds = res;
    });
    let sqlQuery = `
              insert into proyecto (nombre,Lider) values
          `;
    let currQuery = ``;
    let rowCounter = 0;

    for (var i = 0; i < matrixProyectos.length; i++) {
      let nombre = matrixProyectos[i][0].replace("'", "");

      let liderid = empIds[matrixProyectos[i][1]];

      if (!liderid) {
        liderid = 1;
      }

      currQuery = currQuery + `('${nombre}',${liderid}),`;
      rowCounter++;

      if (rowCounter > 990) {
        await dsql.postQuery(formatUtil.term(sqlQuery + currQuery, ";"));
        rowCounter = 0;
        currQuery = ``;
      }
    }

    await dsql.postQuery(formatUtil.term(sqlQuery + currQuery, ";"));
    console.log("Inserted Projects");
  } catch (error) {
    console.log("error", error.message);
  }
}

function processProjects(matrix) {
  res = {};
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    res[row.Nombre] = { id: row.ProyectoID, lider: row.Lider };
  }
  return res;
}

async function getProjectIDs() {
  const query = `
          select ProyectoID, Proyecto.Nombre, Empleado.Nombre as Lider from Proyecto left Join Empleado on Lider = Empleado.EmpleadoID
      `;
  const res = await dsql.getQuery(query);
  return processProjects(res.recordset);
}

module.exports = {
  getProjectByID:getProjectByID,
  getProjectIDByName:getProjectIDByName,
  postProjects:postProjects,
  processProjects:processProjects,
  getProjectIDs:getProjectIDs,
}
