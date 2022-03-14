//IMPORTS
const express = require('express'),
path = require('path'),
cors = require('cors'),
multer = require('multer'),
bodyParser = require('body-parser');
const readXlsxFile = require("read-excel-file/node");


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

const uploaddd = async (req, res) => {
  
};


// Express settings
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


//Endpoints
app.get('/api', function (req, res) {
  res.end('File catcher');
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