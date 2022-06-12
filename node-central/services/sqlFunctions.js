const config = require("../config/dbconfig");
const sql = require("mssql");

let pool;

async function startConnection() {
  pool = await sql.connect(config);
  console.log('Started Connection');
}

async function getQuery(query) {
  try {
    let res = await pool.request().query(query);
    return res;
  } catch (error) {
    console.log("Error en:", query);
    return error;
  }
}

async function postQuery(query) {
  try {
    await pool.query(query);
  } catch (error) {
    console.log("Error en:", query);
    console.log(error);
  }
}

function getRelacionID(relacion) {
  switch (relacion) {
    case "Peer to Peer":
      return 0;

    case "Lider a Equipo":
      return 1;

    case "Equipo a Lider":
      return 2;
  }
}

module.exports = {
  startConnection:startConnection,
  getQuery:getQuery,
  postQuery:postQuery,
  getRelacionID:getRelacionID,
}
