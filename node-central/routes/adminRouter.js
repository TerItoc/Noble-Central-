const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');


router.post("/insertAdmin", async (req, res) => {
  console.log(req.body);
  if (!req.body) {
    console.log("Wrong format insert super user");
    return res.send({
      success: false,
      message: "Wrong format insert super use",
    });
  } else {
    if (req.body.nombre && req.body.correo) {
      res.send(await adminController.insertAdmin(req.body.nombre, req.body.correo));
    } else {
      res.send({ success: false });
    }
  }
});

module.exports = router;


