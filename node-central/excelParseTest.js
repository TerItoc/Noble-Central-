const dfd = require("danfojs-node")
const path = require("path")
var fs = require('fs');

const db = require("./dboperations");

const folder = path.join(process.cwd() , "./node-central");
let local_xcel = folder + "/equipos.xlsx";

mn = {
    projectColumnExcel: 1,
    startingRowExcel : 2,
    employeeColumnExcel: 3,
    startColumnHoursExcel: 4,
    endColumnHoursExcel: 7,
    columnNameEmployees: "Sum(BillHrs)_2",
    jsonDataAttribute: '$data',
    totalsName: "Totals",

}

function sumHours(arr) {
    return arr.filter((element) => typeof element == "number").reduce((a, b) => a+b,0)
}

function getProjectLead(arr){
    if(arr[0] != arr[1]){
        return arr
    }
    return [null,null]
}

function getArrEmpleados(arr){
    resArr = []

    for(var i = 0; i<arr.length;i++){
        let entry = arr[i][mn.columnNameEmployees];
        if(entry != mn.totalsName){
            resArr.push(entry.replace("'", ""));
        }
    };

    return resArr;
}



function getMatrixProyectos(arr){
    return [...new Set(arr[mn.jsonDataAttribute])];
}

async function loadExcelData() {
    let df = await dfd.readExcel(local_xcel);


    let projectAndEmployee = df.iloc({columns: [mn.projectColumnExcel,mn.employeeColumnExcel], rows:[mn['startingRowExcel']+":"], index:["projectname","projectlead","username"]})
    //console.log(projectAndEmployee)
    //dfd.toExcel(df, { filePath: "node-central/testOut.xlsx"});

    let empleados = df.iloc({columns: [mn.employeeColumnExcel], rows:[mn.startingRowExcel+":"]}).toJSON();
    //console.log(getArrEmpleados(empleados))

    //POST EMPLOYEES DISABLED FOR NOW
    //await db.postEmployees(getArrEmpleados(empleados));
    //db.getEmployees().then(result => {console.log(result)})    


    let hours = df.iloc({columns: [mn.startColumnHoursExcel+":"+mn.endColumnHoursExcel], rows:[mn.startingRowExcel+":"], index:["hours"]}).apply(sumHours,{axis:1})
    //hours.print()

    //Get the table for projectLeads
    let projectLeads = df.iloc({columns: [mn.projectColumnExcel+":"+mn.employeeColumnExcel], rows:[mn.startingRowExcel+":"], index:["projectname","projectlead"]}).apply(getProjectLead,{axis:1}).dropNa({ axis: 1 })
    //projectLeads.print()

    //POST PROJECT+EMPLOYEE DISABLE FOR NOW
    //console.log(getMatrixProyectos(projectLeads);
    
    await db.postProjects(getMatrixProyectos(projectLeads));

    //Join the table of hours with the employees
    teams = dfd.concat({ dfList: [hours,projectAndEmployee], axis: 1 }).rename({ "0":"Horas","Sum(BillHrs)_2":"Nombre", "Sum(BillHrs)": "Proyecto" })
    //teams.print()
    
    //Save the teams dataframe
    teams.toJSON({ filePath: folder + "/horas.json" });
    //projectLeads.toJSON({ filePath: path.join(process.cwd(), "./node-central/lideres.json") });
}



loadExcelData()


