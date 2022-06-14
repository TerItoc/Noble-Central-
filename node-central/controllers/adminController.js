const dsql = require('../services/sqlFunctions');

async function insertAdmin(nombre, correo) {
  try {
    const query = `
        INSERT INTO Administradores VALUES ('${nombre}','${correo}')
      `;
    await dsql.postQuery(query);
    return { success: true };
  } catch (error) {
    console.log(error.message);
    return { success: false };
  }
}

module.exports = {
  insertAdmin:insertAdmin,
}