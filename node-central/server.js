//IMPORTS
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const db = require("./dboperations");
const mt = require("./parseExcel");
const { makeTeams } = require('./parseExcel');

db.startConnection();

// Express settings
const app = express();
app.use(express.urlencoded({ extended : true}));
app.use(express.json());
app.use(cors());
app.use(fileUpload());


//Endpoints
app.get('/api', function (req, res) {
  res.end('File catcher');
});

app.get('/getTeams', async (req,res) => {
  return res.send(await db.getTeams());
});

app.get('/getOrphans', async (req,res) => {
  return res.send(await db.getOrphans());
});

app.get('/ifTeam', async (req,res) => {
  return res.send(await db.ifTeam());
});

//app.post('/makeTeams', async (req,res) => {
//  return res.send(await mt.makeTeams());
//});

app.get('/getEmployees', async (req,res) => {
  return res.send(await db.getEmployees());
});

app.post('/addEvaluation', async (req,res) => {
  const {empA,relacion,empB} = req.body;

  await db.addEvaluation(empA,relacion,empB);

  res.send({success:true});

});

app.post('/deleteEvaluation', async (req,res) => {
  const {empA,relacion,empB} = req.body;

  await db.deleteEvaluation(empA,relacion,empB);

  res.send({success:true});

});

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

let upload = multer({
  fileFilter: excelFilter
});

// POST File
app.post('/makeTeams', async (req, res) => {
  //console.log(req.file);
  
  //console.log(req);
  
  if (!req.files.file) {
    console.log("No file sent");
    return res.send({success: false, message : "No file sent"});

  } else { 

    console.log('File is sent');

    try {
      if (req.files.file == undefined) {
        return res.status(400).send({success: false, message : "No file"});
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
  console.log('Connected to port ' + PORT)
})