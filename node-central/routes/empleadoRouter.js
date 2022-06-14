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

router.get("/getEmployees", async (req, res) => {
  return res.send(await empleadoController.getEmployees());
});

module.exports = router;

