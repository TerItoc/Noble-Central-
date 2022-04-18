//IMPORTS
const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const createError = require('http-errors');

const db = require("./dboperations");
const mt = require("./parseExcel");


db.startConnection();

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


const PATH = './storage';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+ "-" +file.originalname)
  }
});

let upload = multer({
  storage: storage,
  fileFilter: excelFilter
});


// Express settings
const app = express();
app.use(express.urlencoded({ extended : true}));
app.use(express.json());
app.use(cors());


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

app.get('/makeTeams', async (req,res) => {
  return res.send(await mt.makeTeams());
});

app.post('/deleteEvaluation', async (req,res) => {
  const {empA,relacion,empB} = req.body;

  await db.deleteEvaluation(empA,relacion,empB);

  res.send({success:true});

});





// POST File
app.post('/api/upload', upload.single('file'), function (req, res) {
  
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });
  } else { 
    console.log('File is available!');

    try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload an excel file!");
      }

      let path = PATH + "/" +req.file.filename;
    
      readXlsxFile(path).then((rows) => {
        //Shift makes row go down
        rows.shift();

        rows.forEach( (row) => {
          let excelRow = {
            id: row[0],
            title: row[1],
            description: row[2],
            published: row[3],
          };

          console.log(excelRow)
        });
      })
  
      return res.send({
        success: true
      })
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }

  }
});

// Create PORT
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log('Connected to port ' + PORT)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});