require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug")("pets:testing:endpoints");
const chalk = require("chalk");
const supertest = require("supertest")
const connectDB = require("../../database/index");
const { app, initializeServer } = require("..");
const Use = require("../../database/models/user");

const request = supertest(app);

let server;
let token;
const apiToken = process.env.TOKEN;

const newUsers = [
  {
    admin: "true",
    username: "pepo",
    password: "pepo"
  },
  {
    admin: "false",
    username: "adrian",
    password: "adrian"
  },
]

beforeAll(async () => {
  await connectDB(process.env.MONGODB_TEST);
  await Use.deleteMany({});
  server = await initializeServer(4001);
  const { body } = 

})
