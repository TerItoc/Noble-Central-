let local = false;
let info = null;
if (local) {
  info = {
    user: "rooty",
    password: "rooty",
    server: "localhost",
    database: "NodeCentral",
    options: {
      trustedConnection: true,
      enableArithAbort: true,
      instancename: "MSSQLSERVER02",
    },
    port: 20729,
    trustServerCertificate: true,
  };
} else {
  info = {
    user: "noblecentral",
    password: "noble123!",
    server: "noblecentral.database.windows.net",
    trustServerCertificate: true,
    database: "NobleCentral",
  };
}

const dbconfig = info;

module.exports = dbconfig;
