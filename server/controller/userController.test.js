
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/user");
const { loginUser, registerUser } = require("./userController");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken")

describe("Given a userController function", () => {
  describe("When it receives a wrong username", () => {
    test("Then it should invoke next function with an 401 error", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          username: "pepe",
          password: "pepe"
        }
      }
      const res = {
        json: jest.fn()
      };
      const next = jest.fn();
      const expectedError = new Error("Naranai");
      expectedError.code = 401;

      await loginUser(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", expectedError.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    })
  })

  describe("When it receives a right username and a wrong password", () => {
    test("Then it should invoke next function with a 401 error", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        id: "2",
        username: "pepe",
        password: "pepe"
      });
      const req = {
        body: {
          username: "pepe",
          password: "pepe"
        }
      }
      const next = jest.fn().mockResolvedValue(false);
      bcrypt.compare = jest.fn();
      const expectedError = new Error("Oju! Wrong Password!");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", expectedError.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    })
  })

  describe("When it receibes a right username and password", () => {
    test("Then it should invoke res.json with a brand new token inside", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        id: "1",
        username: "pepe",
        password: "pepe"
      })
      const expectedToken = "asdf";
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const req = {
        body: {
          username: "pepe",
          password: "pepe"
        }
      }
      const res = {
        json: jest.fn()
      }
      const expectedResponse = {
        token: expectedToken
      }

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    })
  })

  describe("When register function is invoke with username and password that doesn't already exist", () => {
    test("Then it should create a new user", async () => {
      const req = {
        body: {
          username: "samuel",
          password: "ASDF1234",
          admin: true
        }
      };
      const user = req.body;
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn()
      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue({ ...user, password: "ASDF1234" });
      bcrypt.hash = jest.fn().mockResolvedValue("ASDF1234");
      await registerUser(req, res, next);

      expect(User.create).toHaveBeenCalledWith({ ...user, password: "ASDF1234" })
    })
  })

  describe("When register function is invoke with an existent username", () => {
    test("Then it should reject a new error with a 404 code", async () => {
      const error = new Error("Username already exists CHANGE IT");
      error.code = 404;
      const req = {
        body: {
          username: "samuel",
          password: "ASDF1234",
          admin: true
        }
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn()
      User.findOne = jest.fn().mockResolvedValue("samuel");
      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);

    })
  })
})

