const express = require('express');
const router = express.Router();

const empleadoController = require('../controllers/empleadoController');


router.post("/isAdmin", async (req, res) => {
  if (!req.body.correo) {
    res.json({ isAdmin: "No hay correo" });
  } else {
    res.json(await empleadoController.isAdmin(req.body.correo));
  }
});

router.post("/getEmployeeEvals", async (req, res) => {
  if (!req.body.correo || !req.body.all) {
    res.send({ success: false, info: undefined });
  }

  try {
    if (req.body.all == "false") {
      res.send(await empleadoController.getEvaluationsForEmail(req.body.correo, false));
    } else {
      res.send(await empleadoController.getEvaluationsForEmail(req.body.correo, true));
    }
  } catch (error) {
    res.send({ success: false, info: undefined });
  }
});

router.get("/getEmployees", async (req, res) => {
  return res.send(await empleadoController.getEmployees());
});

module.exports = router;

