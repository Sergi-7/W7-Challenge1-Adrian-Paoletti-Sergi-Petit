const debug = require("debug")("series:database");
const mongoose = require("mongoose");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    // mongoose.set("debug", true);
    mongoose.set("toJSON", {
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug("No se ha podido iniciar la DB");
        debug(error.message);
        reject();
        return;
      }
      debug("DB conected");
      resolve();
    });
    mongoose.connection.on("close", () => {
      debug("Desconectado de la base de datos");
    });
  });

module.exports = connectDB;
