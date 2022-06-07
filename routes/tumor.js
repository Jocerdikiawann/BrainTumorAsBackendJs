var express = require("express");
var router = express.Router();
const { tumor_controller } = require("../domain/controller");

router.get("/predictions", tumor_controller.GetAllPredictions);
router.get("/predictions/:id", tumor_controller.GetDetailPredictions);
router.post("/predictions", tumor_controller.CreatePredictions);

module.exports = router;
