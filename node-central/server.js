//IMPORTS
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const db = require("./dboperations");
const mt = require("./parseExcel");
const dboperations = require("./dboperations");

db.startConnection();

// Express settings
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(fileUpload());

//Endpoints
app.get("/getTeams", async (req, res) => {
  return res.send(await db.getTeams());
});

app.get("/getOrphans", async (req, res) => {
  return res.send(await db.getOrphans());
});

app.get("/ifTeam", async (req, res) => {
  return res.send(await db.ifTeam());
});

app.get("/getEmployees", async (req, res) => {
  return res.send(await db.getEmployees());
});

app.post("/addEvaluation", async (req, res) => {
  console.log(req.body.empA);
  await db.addEvaluation(req.body.empA, req.body.relacion, req.body.empB);

  res.send({ success: true });
});

app.post("/deleteEvaluation", async (req, res) => {
  const { empA, relacion, empB } = req.body;

  res.send(await db.deleteEvaluation(empA, relacion, empB));
});

app.get("/ifValidando", async (req, res) => {
  res.send(await db.ifValidando());
});

app.get("/publishTeams", async (req, res) => {
  res.send(await db.publishTeams());
});

app.get("/getTotalStatus", async (req, res) => {
  res.json(await db.getTotalByStatus());
})

app.post("/isAdmin", async (req, res) => {
  if (!req.body.correo) {
    res.json({ isAdmin: "No hay correo" });
  }
  else {
    res.json(await db.isAdmin(req.body.correo));
  }
});

app.post('/generateReport', async(req,res) =>{
  try{
    console.log(req.body.EvaluacionID,req.body.Reporte);
    await db.generateReport(req.body.EvaluacionID,req.body.Reporte);
    res.send(true);
  }
  catch(error){
    res.send({error : error});
  }
})

app.post('/confirmEvals', async(req,res) => {
  try {
    await db.confirmEvals(req.body);
    res.send(true);

  } catch (error) {
    res.send({error : error});
  }
})

app.post("/changeEvalStatus", async (req, res) => {
  if (!req.body.evalId || !req.body.newStatus){
    res.send({ success: false, info: undefined })
  } else {
    res.send(await db.changeEvalStatus(req.body.evalId,req.body.newStatus))
  }
})

app.post("/getEmployeeEvals", async (req, res) => {
  if (!req.body.correo || !req.body.all) {
    res.send({ success: false, info: undefined });
  }

  try {
    if(req.body.all == "false"){
      res.send(await db.getEvaluationsForEmail(req.body.correo,false));
    }
    else{
      res.send(await db.getEvaluationsForEmail(req.body.correo,true));
    }
  } catch (error) {
    res.send({ success: false, info: undefined });
  }
});

app.post("/insertAdmin", async (req,res) => {
  console.log(req.body);
  if (!req.body) {
    console.log("Wrong format insert super user");
    return res.send({ success: false, message: "Wrong format insert super use" });
  } else {
    if(req.body.nombre && req.body.correo){
      res.send(await db.insertAdmin(req.body.nombre,req.body.correo))
    } else {
      res.send({success : false })
    }
  }

})

// POST File
app.post("/makeTeams", async (req, res) => {
  if (!req.files.file) {
    console.log("No file sent");
    return res.send({ success: false, message: "No file sent" });
  } else {
    console.log("File is sent");

    try {
      if (req.files.file == undefined) {
        return res.status(400).send({ success: false, message: "No file" });
      }

      return res.send(await mt.makeTeams(req.files.file));
    } catch (error) {
      console.log(error);

      res.status(500).send({
        success: false,
        message: "Error making teams, excel file may be invalid",
      });
    }
  }
});

// Create PORT
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log("Connected to port " + PORT);
});
