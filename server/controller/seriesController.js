const Serie = require("../../database/models/serie");

const getSeries = async (req, res) => {
  const series = await Serie.find({ user: req.userId });
  res.json(series);
};

const getViewedSeries = async (req, res) => {
  const viewedSeries = await Serie.find({ user: req.userId, seen: true });
  res.json(viewedSeries);
};

const getPendingSeries = async (req, res) => {
  const pendingSeries = await Serie.find({ user: req.userId, seen: false });
  res.json(pendingSeries);
};

const createSerie = async (req, res, next) => {
  try {
    const serie = req.body;
    console.log(serie)
    serie.user = req.userId;
    const newSerie = await Serie.create(serie);
    res.json(newSerie);
  } catch (error) {
    error.code = 400;
    error.message = "Serie not created !";
    next(error);
  }
};

const updateSerie = async (req, res, next) => {
  const serie = req.body;
  try {
    const updatedSerie = await Serie.findByIdAndUpdate(serie.id, serie);
    if (updatedSerie) {
      res.json(updatedSerie);
    } else {
      const error = new Error("Serie not found !");
      error.code = 404;
      next(error);
    }
  } catch {
    const error = new Error("Wrong id");
    error.code = 400;
    next(error);
  }
};

const toggleSerie = async (req, res, next) => {
  const serie = req.body;
  // eslint-disable-next-line no-underscore-dangle
  console.log(serie._id)
  try {
    const toggledSerie = await Serie.findByIdAndUpdate(
      serie.id,
      (serie.seen = true)
    );
    if (toggledSerie.seen === false) {
      res.json(toggledSerie);
    } else {
      const error = new Error("Serie not found !");
      error.code = 404;
      next(error);
    }
  } catch {
    const error = new Error("Wrong id");
    error.code = 400;
    next(error);
  }
};

const deleteSerie = async (req, res, next) => {
  const serie = req.body;
  try {
    const deletedSerie = await Serie.findByIdAndDelete(serie.id);
    if (deletedSerie) {
      res.json(deletedSerie);
    } else {
      const error = new Error("Serie not found !");
      error.code = 404;
      next(error);
    }
  } catch {
    const error = new Error("Wrong id");
    error.code = 400;
    next(error);
  }
};

module.exports = {
  getSeries,
  getViewedSeries,
  getPendingSeries,
  createSerie,
  updateSerie,
  deleteSerie,
  toggleSerie,
};
