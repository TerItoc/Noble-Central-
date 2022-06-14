//IMPORTS
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const dsql = require('./services/sqlFunctions')
dsql.startConnection();

//Import Routers
const adminRouter = require('./routes/adminRouter')
const empRouter = require('./routes/empleadoRouter')
const evalsRouter = require('./routes/evalsRouter')
const teamsRouter = require('./routes/teamsRouter')

// Express settings
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(fileUpload());

//Routes
app.use('/empleado',empRouter);
app.use('/teams',teamsRouter);
app.use('/evals',evalsRouter);
app.use('/admin',adminRouter);

// Create PORT
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log("Connected to port " + PORT);
});
