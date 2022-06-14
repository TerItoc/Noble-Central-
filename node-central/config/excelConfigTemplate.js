const excelTemplateConfig = {
    projectColumnExcel: 1,
    leaderColumnExcel: 2,
    employeeColumnExcel: 3,

    startColumnHoursExcel: 4,
    endColumnHoursExcel: 16,

    startingRowExcel : 3,
    totalsName: "Totals",

    horasMinimas: 40,

    dbIndexForPeerToPeer : 0,
    dbIndexForLiderEquipo : 1,
    dbIndexForEquipoLider : 2,

    sqlColumnaEmpleadoID: "EmpleadoID",
    sqlColumnaEmpleadoNombre: "Nombre",
}

module.exports = excelTemplateConfig;
