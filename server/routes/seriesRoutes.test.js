const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, initializeServer } = require("../index");
require("dotenv").config();
const connectDB = require("../../database/index");
const Serie = require("../../database/models/serie");

const mockObjectId = new mongoose.Types.ObjectId();

const request = supertest(app);

const fakeSeries = [
  {
    name: "got",
    _id: "618b8c2aced14353aa06a7cd",
    platform: mockObjectId,
    seen: true,
  },
  {
    name: "vikins",
    _id: "618b8c2aced14353aa06a7c0",
    platform: mockObjectId,
    seen: false,
  },
];

let server;
let token;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_STRING_TEST);
  await Serie.deleteMany({});
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  const loginResponse = await request
    .post("/users/login")
    .send({ username: "Sergi", password: "sergi7" })
    .expect(200);
  token = loginResponse.body.token;
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

beforeEach(async () => {
  await Serie.create(fakeSeries[0]);
  await Serie.create(fakeSeries[1]);
});

afterEach(async () => {
  await Serie.deleteMany({});
});

describe("Given a /series endpoint", () => {
  describe("When it receives a GET request without a token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.get("/series").expect(401);
    });
  });
  describe("When it receives a GET request with a valid token", () => {
    test("Then it should respond with an array of series and a status 200", async () => {
      const { body } = await request
        .get("/series")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveLength(2);
    });
  });
  describe("When it receives a POST request without a token", () => {
    test("Then it should respond with an 401 error", async () => {
      await request.post("/series").expect(401);
    });
  });
  describe("When it receives a POST request with a valid token", () => {
    test("Then it should respond with the created serie and a status 201", async () => {
      await request
        .post("/series")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "narcos",
          _id: mockObjectId,
          platform: mockObjectId,
          seen: false,
        })
        .expect(200);
    });
  });
});

describe("Given a /series/viewed endpoint", () => {
  describe("When it receives a GET request without a token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.get("/series/viewed").expect(401);
    });
  });
  describe("When it receives a GET request with a valid token", () => {
    test("Then it should respond with an array of series with seen property true and a status 200", async () => {
      const { body } = await request
        .get("/series/viewed")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveLength(1);
    });
  });
});

describe("Given a /series/pending endpoint", () => {
  describe("When it receives a GET request with a valid token", () => {
    test("Then it should with an array of series with seen property true and a status 200", async () => {
      const { body } = await request
        .get("/series/viewed")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveLength(1);
    });
  });
  describe("When it receives a GET request without a token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.get("/series/pending").expect(401);
    });
  });
});

describe("Given a /series/:idSerie endpoint", () => {
  describe("When it receives a DELETE request without a token", () => {
    test("Then it should respond with 400 status and a Wrong id message", async () => {
      await request.delete("/series/1").expect(401);
    });
  });
  describe("When it receives a DELETE request with an id", () => {
    test("Then it should respond with the deleted serie and a status 200", async () => {
      await request
        .delete("/series/618b8c2aced14353aa06a7cd")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
  describe("When it receives a PUT request with an id", () => {
    test("Then it should respond with the updated serie and a status 200", async () => {
      await request
        .put("/series/618b8c2aced14353aa06a7cd")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "narcos",
          _id: "618b8c2aced14353aa06a7cd",
          platform: mockObjectId,
          seen: false,
        })
        .expect(200);
    });
  });
  describe("When it receives a PUT request with an invalid id", () => {
    test("Then it should respond with a 400 error and a Wrong id message", async () => {
      await request
        .put("/series/618b8c2aced14353aa06a7c")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });
});
