const dsql = require('../services/sqlFunctions');
const empController = require('../controllers/empleadoController');


async function ifTeam() {
  let res = await dsql.getQuery(
    `
          SELECT CASE WHEN EXISTS (
              SELECT *
              FROM EvaluaA
          )
          THEN CAST(1 AS BIT)
          ELSE CAST(0 AS BIT) END
      `
  );

  return res.recordset[0][""];
}

async function ifValidando() {
  let res = await dsql.getQuery(`
          SELECT CASE
          WHEN NOT EXISTS(SELECT *
                          FROM   EvaluaA
                          WHERE  Estatus <> -1) THEN 'false'
          ELSE 'true'
      END AS ress
      `);

  return res.recordset[0].ress;
}

async function publishTeams() {
  try {
    let res = await dsql.getQuery(`
              UPDATE EvaluaA
              SET Estatus = 0
          `);

    return { success: true, message: "successful publish" };
  } catch (error) {
    return { success: false, message: "couldnt publish" };
  }
}

function processTeams(recordset) {
  let teams = {};

  for (let i = 0; i < recordset.length; i++) {
    let row = recordset[i];

    let relation = {
      NombreEvaluador: row.Nombre,
      TipoRelacion: row.EvaluacionNombre,
      Estatus: row.estatus,
      EvalId: row.EvalId,
    };

    if (row.Reporte) {
      relation.Reporte = row.Reporte;
    }

    if (teams[row.nombre]) {
      teams[row.nombre].push(relation);
    } else {
      teams[row.nombre] = [relation];
    }
  }

  //console.log(teams);
  let equipos = [];

  for (const [key, value] of Object.entries(teams)) {
    let newEntry = {};
    newEntry.nombre = key;
    newEntry.evaluadores = value;
    equipos.push(newEntry);
  }

  return { equipos: equipos };
}

async function getTeams() {
  let teams = await dsql.getQuery(`
      SELECT DISTINCT EmpA.nombre, EvaluacionNombre, EmpB.Nombre, estatus, Rep.Reporte, EvaluaA.EvaluacionID as EvalId from EvaluaA
      JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID
      JOIN Empleado EmpB ON EvaluaA.EmpleadoB  = EmpB.EmpleadoID
      LEFT JOIN Reportes Rep ON EvaluaA.EvaluacionID = Rep.EvaluacionID
      JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
    `);
  return processTeams(teams.recordset);
}

function processTeamsMatrix(recordset) {
  let resMatrix = [];
  for (let i = 0; i < recordset.length; i++) {
    const jsonn = recordset[i];
    let row = [];
    row.push(jsonn.EmpleadoA);
    row.push(jsonn.TipoEvaluacion);
    row.push(jsonn.EmpleadoB);
    row.push(jsonn.Estatus);
    row.push(jsonn.Reporte);
    resMatrix.push(row);
  }
  return resMatrix;
}

async function getTeamsMatrix() {
  const res = await dsql.getQuery(`select * from AllInfo`);
  return processTeamsMatrix(res.recordset);
}

async function deleteCurrentTeams() {
  await dsql.postQuery(`
      delete EvaluaA
      delete Trabaja_En
      delete Proyecto
      delete Reportes
      delete Empleado
      DBCC CHECKIDENT ('[Proyecto]', RESEED, 0);
      DBCC CHECKIDENT ('[Empleado]', RESEED, 0);
      DBCC CHECKIDENT ('[EvaluaA]', RESEED, 0);
      insert into Empleado(Nombre,Correo) values('EmpleadoNoRegistrado','N/A')`);

  console.log("Deleted current teams");
}

function processOrphans(recordset) {
  huerfanos = {};

  for (let i = 0; i < recordset.length; i++) {
    let row = recordset[i];

    let currProject = { Proyecto: row.Proyecto, Lider: row.Lider };

    if (huerfanos[row.Nombre]) {
      huerfanos[row.Nombre].push(currProject);
    } else {
      huerfanos[row.Nombre] = [currProject];
    }
  }

  //console.log(huerfanos);

  let huerfanosParsed = [];
  for (const [key, value] of Object.entries(huerfanos)) {
    let newEntry = {};
    newEntry.nombreHuerfano = key;
    newEntry.proyectos = value;
    //console.log(newEntry);
    huerfanosParsed.push(newEntry);
  }

  return { huerfanos: huerfanosParsed };
}

async function getOrphans() {
  let orphans = await dsql.getQuery(`
          SELECT EmpHuerfano.Nombre AS Nombre, Proyecto.Nombre AS Proyecto, EmpLider.Nombre AS Lider
          FROM Trabaja_En
          JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
          JOIN Empleado EmpHuerfano ON Trabaja_En.EmpleadoID = EmpHuerfano.EmpleadoID
          join Empleado EmpLider ON Proyecto.Lider = EmpLider.EmpleadoID
          where EmpHuerfano.Nombre in (SELECT distinct nombre FROM Empleado
          WHERE nombre NOT in (SELECT DISTINCT EmpA.Nombre from EvaluaA
                                  JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID))
      `);
  //console.log(processTeams(teams.recordset));

  return processOrphans(orphans.recordset);
}

module.exports = {
  ifTeam:ifTeam,
  ifValidando:ifValidando,
  publishTeams:publishTeams,
  processTeams:processTeams,
  getTeams:getTeams,
  processTeamsMatrix:processTeamsMatrix,
  getTeamsMatrix:getTeamsMatrix,
  deleteCurrentTeams:deleteCurrentTeams,
  processOrphans:processOrphans,
  getOrphans:getOrphans,
}

