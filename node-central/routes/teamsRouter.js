const express = require('express');
const router = express.Router();

const teamsController = require('../controllers/teamsController');
const parseExcelService = require('../services/parseExcel');

router.post("/makeTeams", async (req, res) => {
  if (!req.files.file) {
    console.log("No file sent");
    return res.send({ success: false, message: "No file sent" });
  } else {
    console.log("File is sent");

    try {
      if (req.files.file == undefined) {
        return res.status(400).send({ success: false, message: "No file" });
      }

      return res.send(await parseExcelService.makeTeams(req.files.file));
    } catch (error) {
      console.log(error);

      res.status(500).send({
        success: false,
        message: "Error making teams, excel file may be invalid",
      });
    }
  }
});

router.get("/ifValidando", async (req, res) => {
  res.send(await teamsController.ifValidando());
});

router.get("/getTeamsMatrix", async (req, res) => {
  res.send(await teamsController.getTeamsMatrix());
});

router.get("/publishTeams", async (req, res) => {
  res.send(await teamsController.publishTeams());
});

router.get("/ifTeam", async (req, res) => {
  return res.send(await teamsController.ifTeam());
});

router.get("/getOrphans", async (req, res) => {
  return res.send(await teamsController.getOrphans());
});

router.get("/getTeams", async (req, res) => {
  return res.send(await teamsController.getTeams());
});

module.exports = router;

