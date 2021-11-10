
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const debug = require("debug")("series:server");

const app = express();
app.use(cors());
app.use(express.json());

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(`Escuchando en el puerto ${port}`);
      resolve(server)
    })

    server.on("error", () => {
      debug("Ha habido un error al iniciar el servidor");
      reject();
    })
  })

app.use(morgan("dev"));

/* app.use("/users");
app.use("/platforms");
app.use("/series"); */

module.exports = { app, initializeServer }