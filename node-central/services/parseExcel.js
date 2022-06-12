XLSX = require("xlsx");
const path = require("path");
var fs = require("fs");
var Papa = require("papaparse");

const xlConfig = require("../config/excelConfigTemplate");
const dsql = require("../services/sqlFunctions"); 
const formatUtil = require('../services/formatting')

const empController = require("../controllers/empleadoController");
const projectController = require("../controllers/projectController");
const horasController = require("../controllers/horasController");
const teamsController = require("../controllers/teamsController");
const evalsController = require("../controllers/evalsController");

const relativePathXl = "/tmp/equipos.xlsx";
const relativePathOutputXl = "/tmp/equipos.csv";

function loadExcel(file) {
  const folder = path.join(process.cwd());
  saveExcelName = folder + relativePathXl;

  fs.writeFileSync(saveExcelName, file.data, (error) => {
    if (error) {
      console.log(error);
    }
  });

  outputFilename = folder + relativePathOutputXl;

  const workBook = XLSX.readFile(saveExcelName);
  XLSX.writeFile(workBook, outputFilename, { bookType: "csv" });

  var content = fs.readFileSync(outputFilename, "utf8");

  var excelData = null;

  Papa.parse(content, {
    header: false,
    delimiter: ",",
    complete: function (results) {
      excelData = results.data;
    },
  });

  return excelData;
}

function sumHours(arr) {
  let resarr = arr.filter((element) => parseFloat(element));

  if (resarr.length == 0) {
    return [0];
  }

  return resarr.reduce((a, b) => Number(a) + Number(b), 0);
}

function getEmployeeNames(dataMatrix) {
  return dataMatrix.map((value) => {
    return value[xlConfig.employeeColumnExcel];
  });
}

function getLeaderForProject(dataMatrix, projectName) {
  return dataMatrix.filter((row) => row[0] == projectName)[0][1];
}

function getProjectsEmployeeWorkedOn(dataMatrix, empleado, hours) {
  return dataMatrix
    .filter((row) => row[1] == empleado && row[2] >= hours)
    .map((value) => {
      return value[0];
    });
}

function getEmployeesThatWorkedOnProject(dataMatrix, projectName, hours) {
  return dataMatrix
    .filter((row) => row[0] == projectName && row[2] >= hours)
    .map((value) => {
      return value[1];
    });
}

function reduceMatrix(matrix) {
  let res = [];

  //We pop the first rows so we start at the entries
  for (let index = 0; index < xlConfig.startingRowExcel; index++) {
    matrix.shift();
  }

  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];

    if (row[xlConfig.employeeColumnExcel] == "Totals") {
      continue;
    }

    let hoursRow = row.slice(
      xlConfig.startColumnHoursExcel,
      xlConfig.endColumnHoursExcel
    );
    let hours = sumHours(hoursRow);

    let resrow = row.slice(0, xlConfig.employeeColumnExcel + 1);
    resrow.push(hours);
    res.push(resrow);
  }
  return res;
}

function getProjectsAndLeaders(matrix) {
  let res = [];

  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];
    //El totals define un nuevo proyecto
    if (row[xlConfig.employeeColumnExcel] == xlConfig.totalsName) {
      console.log(row);
      let resrow = [row[xlConfig.projectColumnExcel]];
      resrow.push(row[xlConfig.leaderColumnExcel]);
      console.log(resrow);
      res.push(resrow);
    }
  }

  return res;
}

function getHoursPerEmployeePerProject(matrix) {
  let res = [];

  //Last line is empty
  matrix.pop();

  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];

    let resrow = [];
    resrow.push(row[xlConfig.projectColumnExcel]);
    resrow.push(row[xlConfig.employeeColumnExcel]);
    resrow.push(Number(row.splice(-1)));

    res.push(resrow);
  }

  return res;
}

function getEvaluationType(lider, empleadoA, empleadoB) {
  if (empleadoA == empleadoB) {
    return -1;
  }
  if (empleadoA == lider) {
    return xlConfig.dbIndexForLiderEquipo;
  }

  if (empleadoB == lider) {
    return xlConfig.dbIndexForEquipoLider;
  }
  return xlConfig.dbIndexForPeerToPeer;
}

async function makeTeams(file) {
  console.log("Making Teams");

  try {
    //Parse
    let rawExcelData = loadExcel(file);

    //Sums hours and removes totals
    let excelData = reduceMatrix(rawExcelData);

    //Gets employees;
    let allEmployees = getEmployeeNames(excelData);

    //Leaders needs raws for totals
    let leaderWithProject = getProjectsAndLeaders(rawExcelData);

    //Entries
    let hoursPerEmployee = getHoursPerEmployeePerProject(excelData);

    await teamsController.deleteCurrentTeams();

    await empController.postEmployees(allEmployees);
    console.log(leaderWithProject);
    await projectController.postProjects(leaderWithProject);
    await horasController.postHorasPorEmpleado(hoursPerEmployee);

    //Ya que posteamos los empleados extraemos para saber el ID de cada uno

    //Esto deberia estar en dbOperations
    empIds = null;
    await empController.getEmployeeIDs().then((res) => {
      empIds = res;
    });

    let sqlQuery = `Insert Into EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) values `;
    let currQuery = ``;
    let rowCounter = 0;
    let storedEvals = {};

    for (let idx = 0; idx < allEmployees.length; idx++) {
      let empleado = allEmployees[idx];

      arrProjectsWorkedOn = getProjectsEmployeeWorkedOn(
        hoursPerEmployee,
        empleado,
        xlConfig.horasMinimas
      );

      for (let i = 0; i < arrProjectsWorkedOn.length; i++) {
        let currProj = arrProjectsWorkedOn[i];

        let lider = getLeaderForProject(leaderWithProject, currProj);

        let peerEmployees = getEmployeesThatWorkedOnProject(
          hoursPerEmployee,
          currProj,
          xlConfig.horasMinimas
        );

        for (let j = 0; j < peerEmployees.length; j++) {
          let empleadoB = peerEmployees[j];

          //Get type of relationship
          let rel = getEvaluationType(lider, empleado, empleadoB);

          if (rel == -1) {
            continue;
          }
          let cQ =
            "(" +
            empIds[empleado] +
            "," +
            rel +
            "," +
            empIds[empleadoB] +
            ", -1),";

          if (storedEvals[cQ] == 1) {
            continue;
          } else {
            currQuery = currQuery + cQ;
            rowCounter++;
            storedEvals[cQ] = 1;
          }

          if (rowCounter > 500) {
            await dsql.postQuery(formatUtil.term(sqlQuery + currQuery, ";"));
            rowCounter = 0;
            currQuery = ``;
          }
        }
      }
    }

    await dsql.postQuery(formatUtil.term(sqlQuery + currQuery, ";"));

    console.log("Finished Teams");

    return { success: true, message: "Made Teams" };
  } catch (error) {
    console.log(error);

    return { success: false, message: "Error Parseando el Excel" };
  }
}

module.exports = {
  makeTeams: makeTeams,
};
