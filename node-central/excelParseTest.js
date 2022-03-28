const dfd = require("danfojs-node")
const path = require("path")
var fs = require('fs');

const folder = path.join(process.cwd() , "./node-central");

let local_xcel = folder + "/equipos.xlsx";

class Relationship {
    constructor(evaluador_,tipo_){
        this.evaluador = evaluador_;
        this.tipo = tipo_;
    }
}

class Empleado {
    constructor(nombre_){
        this.nombre = nombre_;
        this.evaluadores = [];
    }
}

function sumHours(arr) {
    return arr.filter((element) => typeof element == "number").reduce((a, b) => a+b,0)
}

function projectLeadsToJson(projectLeads){
    pLs = {}

    for(var i = 0; i < projectLeads.values.length; i++){
        //NombreProyecto:Lider
        pLs[projectLeads.values[i][0]] = projectLeads.values[i][1];
    }

    return pLs
}

function getProjectLead(arr){
    if(arr[0] != arr[1] && arr[1] != "Totals"){
        return arr
    }
    return [null,null]
}

async function loadExcelData() {
    let df = await dfd.readExcel(local_xcel)
    //console.log(df.values)

    let sdfteams = df.iloc({columns: [1,3], rows:["2:"], index:["projectname","projectlead","username"]})
    console.log(sdfteams.values)

    let hours = df.iloc({columns: ["4:7"], rows:["2:"], index:["hours"]}).apply(sumHours,{axis:1})
    //hours.print()


    //Get the table for projectLeads
    let projectLeads = df.iloc({columns: ["1:3"], rows:["2:"], index:["projectname","projectlead"]})
                                                                        .apply(getProjectLead,{axis:1})
                                                                        .dropNa({ axis: 1 })
                                                                        .rename({"Sum(BillHrs)":"NombreProyecto","Sum(BillHrs)_1":"NombreLider"})
    
    //projectLeads.print()
    
    //Turn the table into JSON for easier access
    let pLs = projectLeadsToJson(projectLeads);

    fs.writeFile((folder + "/pLs.json"), JSON.stringify(pLs), function(err) {
        if (err) {
            console.log(err);
        }
    });

    //Join the table of hours with the employees
    teams = dfd.concat({ dfList: [hours,sdfteams], axis: 1 }).rename({ "0":"Horas","Sum(BillHrs)_2":"Nombre", "Sum(BillHrs)": "Proyecto" })
    //teams.print()
    
    //Save the teams dataframe
    teams.toJSON({ filePath: folder + "/horas.json" });
    //projectLeads.toJSON({ filePath: path.join(process.cwd(), "./node-central/lideres.json") });
}

async function getLeaders() {
    var jsonEntries = require(folder + "/horas.json");
    var jsonLeaders = require(folder + "/pLs.json");

    //console.log(jsonLeaders);

    let allTeams = {};

    //Para todos los proyecto recorremos los horas y agregamos el lider correspondiente
    for (var i = 0; i < jsonEntries.length; i++){
        let entry = jsonEntries[i];
        
        if(entry["Nombre"] == "Totals"){
            continue
        }

        if(entry["Horas"] < 50){
            continue
        }
        
        for (var j = 0; j < jsonEntries.length; j++){
            let entryChecking = jsonEntries[j];

            if(entryChecking == entry){
                continue;
            }

            if(entryChecking["Nombre"] == "Totals"){
                continue;
            }

            let liderProyecto = jsonLeaders[entryChecking["Proyecto"]]

            if(entryChecking["Horas"] >= 50 && entryChecking["Proyecto"] == entry["Proyecto"]){

                if(entry["Nombre"] in allTeams){
                    allTeams[entry["Nombre"]].push(entryChecking["Nombre"]);
                }
                else{
                    allTeams[entry["Nombre"]] = [entryChecking["Nombre"]];
                }
            }
           
        }
    }

    //console.log(allTeams)
    console.log(jsonEntries)
}

loadExcelData()
//getLeaders()
