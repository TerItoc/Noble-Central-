const dsql = require('../services/sqlFunctions');
const xlConfig = require('../config/excelConfigTemplate');
const empController = require('../controllers/empleadoController');
const teamsController = require('../controllers/teamsController');

async function deleteEvaluation(empA, relacion, empB) {
  try {
    let relacionID = dsql.getRelacionID(relacion);

    let idEmpA = null;
    await empController.getEmployeeIdByName(empA).then((res) => {
      idEmpA = res;
    });
    let idEmpB = null;
    await empController.getEmployeeIdByName(empB).then((res) => {
      idEmpB = res;
    });

    //console.log(idEmpA,relacionID,idEmpB);
    var query;

    switch (relacionID) {
      case 0:
        query = `
                    SELECT * FROM EvaluaA WHERE (EmpleadoA = ${idEmpA} AND TipoEvaluacion = 0 AND EmpleadoB = ${idEmpB}) OR (EmpleadoA = ${idEmpB} AND TipoEvaluacion = 0 AND EmpleadoB = ${idEmpA});
                `;
        break;

      case 1:
        query = `
                    SELECT * FROM EvaluaA WHERE (EmpleadoA = ${idEmpA} AND TipoEvaluacion = 1 AND EmpleadoB = ${idEmpB}) OR (EmpleadoA = ${idEmpB} AND TipoEvaluacion = 2 AND EmpleadoB = ${idEmpA});
                `;
        break;

      case 2:
        query = `
                    SELECT * FROM EvaluaA WHERE (EmpleadoA = ${idEmpA} AND TipoEvaluacion = 2 AND EmpleadoB = ${idEmpB}) OR (EmpleadoA = ${idEmpB} AND TipoEvaluacion = 1 AND EmpleadoB = ${idEmpA});
                `;
        break;

      default:
        -1;
    }

    const res = await dsql.getQuery(query);

    for (let i = 0; i < res.recordset.length; i++) {
      const row = res.recordset[i];
      await dsql.postQuery(`
          DELETE FROM Reportes WHERE EvaluacionId = ${row.EvaluacionID}
          DELETE FROM EvaluaA WHERE EvaluacionId = ${row.EvaluacionID} 
        `);
      console.log(`Deleted : ${row.EvaluacionID}`);
    }
    return { success: true };
  } catch (error) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
}

async function getEvaluationsForEmail(correo, all) {
  let query;
  if (all) {
    query = `select EvaluaA.EvaluacionID, EmpA.Nombre as EmpleadoANombre, EmpB.Nombre as EmpleadoBNombre, Evaluacion.EvaluacionNombre as TipoEvaluacion, EvaluaA.Estatus as Estatus, Rep.Reporte
          from EvaluaA
          Join Empleado EmpB on EvaluaA.EmpleadoB = EmpB.EmpleadoID
          Join Empleado EmpA on EvaluaA.EmpleadoA = EmpA.EmpleadoID
          Left Join Reportes Rep on EvaluaA.EvaluacionID = Rep.EvaluacionID
          Join Evaluacion on EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
          where EmpleadoA = (select EmpleadoID from Empleado where Correo = '${correo}')`;
  } else {
    query = `select EvaluaA.EvaluacionID, EmpA.Nombre as EmpleadoANombre, EmpB.Nombre as EmpleadoBNombre, Evaluacion.EvaluacionNombre as TipoEvaluacion, EvaluaA.Estatus as Estatus, Rep.Reporte
          from EvaluaA
          Join Empleado EmpB on EvaluaA.EmpleadoB = EmpB.EmpleadoID
          Join Empleado EmpA on EvaluaA.EmpleadoA = EmpA.EmpleadoID
          Left Join Reportes Rep on EvaluaA.EvaluacionID = Rep.EvaluacionID
          Join Evaluacion on EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
          where EmpleadoA = (select EmpleadoID from Empleado where Correo = '${correo}') and Estatus = 0`;
  }
  let evals = await dsql.getQuery(query);
  return evals.recordset;
}

async function generateReport(evalID, report) {
  try {
    await dsql.postQuery(`
              UPDATE EvaluaA SET Estatus = 2 WHERE EvaluacionID = ${evalID}
              INSERT INTO Reportes values (${evalID},'${report}')
          `);

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

async function changeEvalStatus(evalId, newStatus) {
  try {
    await dsql.postQuery(`
            Update EvaluaA
            SET Estatus = ${newEstatus}
            Where EvaluacionID = ${evalId}
          `);

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

async function confirmEvals(evalsID) {
  try {
    let stringy = "(" + evalsID.join(",") + ")";
    await dsql.postQuery(`
              UPDATE EvaluaA
              SET Estatus = 1
              WHERE EvaluacionID IN ${stringy}
          `);

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

function turnSQLtoJsonEmpIds(sqlRes) {
  let res = {};

  for (let i = 0; i < sqlRes.length; i++) {
    let row = sqlRes[i];
    res[row[xlConfig.sqlColumnaEmpleadoNombre]] = row[xlConfig.sqlColumnaEmpleadoID];
  }
  return res;
}

async function addEvaluation(empA, TipoRelacion, empB) {
  //console.log("Literally here: ",empA,TipoRelacion,empB)
  let relacionID = dsql.getRelacionID(TipoRelacion);

  if (empA == empB) {
    return;
  }

  let validando = null;
  await teamsController.ifValidando().then((res) => {
    validando = res;
  });

  if (validando == "true") {
    estatus = 0;
  } else {
    estatus = -1;
  }

  let idEmpA = null;
  await empController.getEmployeeIdByName(empA).then((res) => {
    idEmpA = res;
  });
  let idEmpB = null;
  await empController.getEmployeeIdByName(empB).then((res) => {
    idEmpB = res;
  });

  //console.log(idEmpA,relacionID,idEmpB);
  var query;

  switch (relacionID) {
    case 0:
      query = `
                  INSERT INTO EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) Values (${idEmpA},0,${idEmpB},${estatus}),(${idEmpB},0,${idEmpA},${estatus});
              `;
      break;

    case 1:
      query = `
                  INSERT INTO EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) Values (${idEmpA},1,${idEmpB},${estatus}),(${idEmpB},2,${idEmpA},${estatus});
              `;
      break;

    case 2:
      query = `
                  INSERT INTO EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) Values (${idEmpA},2,${idEmpB},${estatus}),(${idEmpB},1,${idEmpA},${estatus});
              `;
      break;

    default:
      -1;
  }

  //console.log("Added Evaluation" ,empA,idEmpA,relacionID,empB,idEmpB, "y su viceversa");
  await dsql.postQuery(query);
}

async function getTotalByStatus() {
  return await dsql.getQuery(
    `SELECT COUNT(EvaluacionID) as Total, Estatus FROM EvaluaA GROUP BY Estatus`
  );
}

module.exports = {
  deleteEvaluation:deleteEvaluation,
  getEvaluationsForEmail:getEvaluationsForEmail,
  generateReport:generateReport,
  changeEvalStatus:changeEvalStatus,
  confirmEvals:confirmEvals,
  turnSQLtoJsonEmpIds:turnSQLtoJsonEmpIds,
  addEvaluation:addEvaluation,
  getTotalByStatus:getTotalByStatus,
}
