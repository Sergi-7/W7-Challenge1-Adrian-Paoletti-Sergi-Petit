const { Schema, model, Types } = require("mongoose");

const serieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  platform: {
    type: Types.ObjectId,
    ref: "platform",
    required: true,
  },
  seen: {
    type: Boolean,
    required: true,
  },
});

const Serie = model("Serie", serieSchema);

module.exports = Serie;
