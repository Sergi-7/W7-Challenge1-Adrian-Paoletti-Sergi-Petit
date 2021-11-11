
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

      const user = {
        username: "samuel",
        password: "ASDF1234",
        admin: true
      }
      const { username } = user
      const req = {
        body: user
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn()
      User.create = jest.fn().mockResolvedValue({ username });
      await registerUser(req, res, next);

      expect(User.create).toHaveBeenCalledWith(username)
    })
  })
})

