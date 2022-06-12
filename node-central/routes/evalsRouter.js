const express = require('express');
const router = express.Router();

const evalsController = require('../controllers/evalsController');

router.post("/changeEvalStatus", async (req, res) => {
  if (!req.body.evalId || !req.body.newStatus) {
    res.send({ success: false, info: undefined });
  } else {
    res.send(await evalsController.changeEvalStatus(req.body.evalId, req.body.newStatus));
  }
});

router.post("/confirmEvals", async (req, res) => {
  try {
    await evalsController.confirmEvals(req.body);
    res.send(true);
  } catch (error) {
    res.send({ error: error });
  }
});

router.post("/generateReport", async (req, res) => {
  try {
    console.log(req.body.EvaluacionID, req.body.Reporte);
    await evalsController.generateReport(req.body.EvaluacionID, req.body.Reporte);
    res.send(true);
  } catch (error) {
    res.send({ error: error });
  }
});

router.get("/getTotalStatus", async (req, res) => {
  res.json(await evalsController.getTotalByStatus());
});

router.post("/deleteEvaluation", async (req, res) => {
  const { empA, relacion, empB } = req.body;

  res.send(await evalsController.deleteEvaluation(empA, relacion, empB));
});

router.post("/addEvaluation", async (req, res) => {
  console.log(req.body.empA);
  await evalsController.addEvaluation(req.body.empA, req.body.relacion, req.body.empB);

  res.send({ success: true });
});

module.exports = router;
