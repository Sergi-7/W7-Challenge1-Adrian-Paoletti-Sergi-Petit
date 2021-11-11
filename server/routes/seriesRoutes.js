const express = require("express");
const { getSeries, createSerie, updateSerie, deleteSerie, toggleSerie, getViewedSeries, getPendingSeries } = require("../controller/seriesController");

const router = express.Router();

router.get("/", getSeries);
router.post("/", createSerie);
router.get("/viewed", getViewedSeries);
router.get("/pending", getPendingSeries);
router.put("/:idSerie", updateSerie);
router.delete("/:idSerie", deleteSerie);
router.patch("/view/:idSerie", toggleSerie);

module.exports = router;