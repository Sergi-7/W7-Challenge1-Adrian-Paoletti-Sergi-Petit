const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  seriesAll: {
    type: [Types.ObjectId],
    ref: 'Serie',
  },
  seriesViwed: {
    type: [Types.ObjectId],
    ref: 'Serie',
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
