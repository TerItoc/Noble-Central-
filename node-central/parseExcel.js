XLSX = require('xlsx');
const path = require("path")
var fs = require('fs');
var Papa = require('papaparse');

const db = require("./dboperations");

//Magic Numbers
mn = {
    projectColumnExcel: 1,
    leaderColumnExcel: 2,
    employeeColumnExcel: 3,

    startColumnHoursExcel: 4,
    endColumnHoursExcel: 10,

    startingRowExcel : 3,
    totalsName: "Totals",
}

function loadExcel(filePath){
    const folder = path.join(process.cwd() , "./node-central");
    let local_xcel = folder + "/equipos.xlsx";
    outputFilename = folder + "/equipos.csv"
    
    const workBook = XLSX.readFile(local_xcel);
    XLSX.writeFile(workBook,outputFilename , { bookType: "csv" });
    
    var content = fs.readFileSync(outputFilename, "utf8");
    
    var excelData = null 
    
    Papa.parse(content, {
        header: false,
        delimiter: ",",
        complete: function(results) {
            excelData = results.data;
        }
    });
    
    return excelData

}

function sumHours(arr) {
    //console.log(arr);
    return arr.filter((element) => parseFloat(element)).reduce((a, b) => Number(a)+Number(b),0)
}

function reduceMatrix(matrix){
    let res = [];

    //We pop the first rows so we start at the entries
    for (let index = 0; index < mn.startingRowExcel; index++) {
        matrix.shift();        
    }

    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i];

        if(row[mn.employeeColumnExcel] == "Totals"){
            continue;
        }

        let hoursRow = row.slice(mn.startColumnHoursExcel,mn.endColumnHoursExcel);
        let hours = sumHours(hoursRow);

        let resrow = row.slice(0,mn.employeeColumnExcel+1);
        resrow.push(hours);
        res.push(resrow);
        
    }

    return res;
}


function getProjectsAndLeaders(matrix){
    let res = [];

    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i];
        //console.log(row);

        //El totals define un nuevo proyecto
        if(row[mn.employeeColumnExcel] == "Totals"){
            let resrow = [row[mn.projectColumnExcel]]
            resrow.push(row[mn.leaderColumnExcel])
            res.push(resrow);
        }
    }

    return res;
}

function getHoursPerEmployeePerProject(matrix){
    let res = [];

    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i];

        let resrow = []
        resrow.push(row[mn.projectColumnExcel])
        resrow.push(row[mn.employeeColumnExcel])
        resrow.push(Number(row.splice(-1)))
        
        res.push(resrow)
    }

    return res;
}

let rawExcelData = loadExcel();

//Sums hours and removes totals
let excelData = reduceMatrix(rawExcelData);
//console.log(excelData);

//Leaders needs raws for totals
let leaderWithProject = getProjectsAndLeaders(rawExcelData);
//console.log(leaderWithProject);

let hoursPerEmployee = getHoursPerEmployeePerProject(excelData);
//console.log(hoursPerEmployee);

//await db.postEmployees(getArrEmpleados(empleados));
db.getEmployees().then(result => {console.log(result)})   

//await db.postProjects(getMatrixProyectos(projectLeads));


