require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

const registerUser = async (req, res, next) => {
  try {
    const user = req.body;
    const { username } = req.body;
    const userCheck = await User.findOne({ username });
    if (userCheck !== null) {
      const error = new Error("Username already exists CHANGE IT");
      error.code = 404;
      next(error);
    } else {
      const userHashedPassword = await bcrypt.hash(user.password, 10)
      const newUser = await User.create({ ...user, password: userHashedPassword });
      if (newUser) {
        res.json(newUser)
      } else {
        const error = new Error("Not posibol to create User");
        error.code = 404;
        next(error);
      }
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
}

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    console.log(user.username)
    if (!user) {
      const error = new Error("Naranai");
      error.code = 401;
      next(error);
    } else {
      const rightPassword = await bcrypt.compare(password, user.password);
      if (!rightPassword) {
        const error = new Error("Oju! Wrong Password!");
        error.code = 401;
        next(error);
      } else {
        const token = jwt.sign({
          id: user.id,
          username: user.username
        },
          process.env.SECRET
        );
        res.json({ token });
      }
    }
  } catch (error) {
    console.log("errata", error.message)
  }
}

module.exports = {
  registerUser,
  loginUser
}
