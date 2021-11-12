const debug = require("debug")("series:seriesController");
const chalk = require("chalk");
const Serie = require("../../database/models/serie");
const User = require("../../database/models/user");


const getSeries = async (req, res) => {
  const user = await User.findOne({ _id: req.userId })
    .populate([{
      path: "seriesAll",
    }, {
      path: "seriesViwed",
    }]);
  res.json(user.seriesAll);
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
    serie.user = req.userId;
    const newSerie = await Serie.create(serie);
    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findOne({ _id: req.userId });
    console.log(user);
    // eslint-disable-next-line no-underscore-dangle
    user.seriesAll = [...user.seriesAll, newSerie._id];
    if (newSerie.seen) {
      // eslint-disable-next-line no-underscore-dangle
      user.seriesViwed = [...user.seriesViwed, newSerie._id]
    }
    await user.save(user);
    res.json(newSerie);
  } catch (error) {
    error.code = 400;
    error.message = "Serie not created !";
    next(error);
  }
};

const updateSerie = async (req, res, next) => {
  const serie = req.body;
  const { idSerie } = req.params;
  try {
    const updatedSerie = await Serie.findByIdAndUpdate(idSerie, serie);
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
  console.log(serie._id);
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
  const { idSerie } = req.params;
  console.log(idSerie);
  try {
    const deletedSerie = await Serie.findByIdAndDelete(idSerie);
    if (deletedSerie) {
      res.json(deletedSerie);
      console.log(deletedSerie);
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
