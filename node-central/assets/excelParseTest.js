const dfd = require("danfojs-node")
const path = require("path")
const fs = require('fs');

const xlConfig = require('../config/excelConfigTemplate');

const folder = path.join(process.cwd() , "./node-central");
let local_xcel = folder + "/equipos.xlsx";


function getProjectLead(arr){
    if(arr[0] != arr[1]){
        return arr
    }
    return [null,null]
}

function getArrEmpleados(arr){
    resArr = []

    for(var i = 0; i<arr.length;i++){
        let entry = arr[i][xlConfig.columnNameEmployees];
        if(entry != xlConfig.totalsName){
            resArr.push(entry.replace("'", ""));
        }
    };

    return resArr;
}



function getMatrixProyectos(arr){
    return [...new Set(arr[xlConfig.jsonDataAttribute])];
}

async function loadExcelData() {
    let df = await dfd.readExcel(local_xcel);

    let projectAndEmployee = df.iloc({columns: [xlConfig.projectColumnExcel,xlConfig.employeeColumnExcel], rows:[xlConfig['startingRowExcel']+":"], index:["projectname","projectlead","username"]})

    let empleados = df.iloc({columns: [xlConfig.employeeColumnExcel], rows:[xlConfig.startingRowExcel+":"]}).toJSON();

    db.getEmployees().then(result => {console.log(result)})    

    let hours = df.iloc({columns: [xlConfig.startColumnHoursExcel+":"+xlConfig.endColumnHoursExcel], rows:[xlConfig.startingRowExcel+":"], index:["hours"]}).apply(sumHours,{axis:1})

    //Get the table for projectLeads
    let projectLeads = df.iloc({columns: [xlConfig.projectColumnExcel+":"+xlConfig.employeeColumnExcel], rows:[xlConfig.startingRowExcel+":"], index:["projectname","projectlead"]}).apply(getProjectLead,{axis:1}).dropNa({ axis: 1 })

    //Join the table of hours with the employees
    teams = dfd.concat({ dfList: [hours,projectAndEmployee], axis: 1 }).rename({ "0":"Horas","Sum(BillHrs)_2":"Nombre", "Sum(BillHrs)": "Proyecto" })
    
    //Save the teams dataframe
    teams.toJSON({ filePath: folder + "/horas.json" });
    //projectLeads.toJSON({ filePath: path.join(process.cwd(), "./node-central/lideres.json") });
}



loadExcelData()


