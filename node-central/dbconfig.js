`const dbconfig = {
    user:'rooty',
    password:'rooty',
    server : "localhost",
    database: "NodeCentral",
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        instancename: "MSSQLSERVER02",
    },
    port : 20729,
    trustServerCertificate: true,
}`

const dbconfig = {
    user:'noblecentral',
    password:'noble123!',
    server : "noblecentral.database.windows.net",
    trustServerCertificate: true,
    database: 'NobleCentral'
}


module.exports = dbconfig;