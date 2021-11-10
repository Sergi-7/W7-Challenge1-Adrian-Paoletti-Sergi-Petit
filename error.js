const debug = require("debug")("series:error");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Not Endpoint found" });
}

const generalErrorHandler = (error, req, res, next) => {
  debug("Error: ", error.message);
  const message = error.code ? error.message : "Holistic error";
  res.status(error.code || 500).json({ error: message });
};

module.exports = {
  notFoundErrorHandler,
  generalErrorHandler
}