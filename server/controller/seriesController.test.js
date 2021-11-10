const Serie = require("../../database/models/serie");
const {
  getSeries,
  getViewedSeries,
  // getPendingSeries,
  // deleteSerie,
  // toggleSerie,
  createSerie,
  updateSerie,
  deleteSerie,
} = require("./seriesController");

jest.mock("../../database/models/serie");

describe("Given a getSeries function", () => {
  describe("When it receives an object res", () => {
    test("Then it should invoke the method json", async () => {
      const series = [
        { id: 1, name: "Matrix", seen: true, platform: "netflix" },
        { id: 2, name: "Vikings", seen: false, platform: "netflix" },
      ];
      Serie.find = jest.fn().mockResolvedValue(series);
      const req = {
        userId: "5",
      };
      const res = {
        json: jest.fn(),
      };
      await getSeries(req, res);

      expect(Serie.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(series);
    });
  });
});

describe("Given a getViewedSeries function", () => {
  describe("When it receives a request with an id 1 and a res object", () => {
    test("Then it should call Serie.find with property seen on true", async () => {
      Serie.find = jest.fn().mockResolvedValue({ seen: true });
      const series = [
        { id: 1, name: "Matrix", seen: true, platform: "netflix" },
        { id: 2, name: "Vikings", seen: false, platform: "netflix" },
      ];
      const req = {
        userId: 5,
        seen: true,
      };

      const res = {
        json: jest.fn(),
      };

      await getViewedSeries(req, res);

      expect(Serie.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(series[0]);
    });
  });
});

describe("Given a getPendingSeries function", () => {
  describe("When it receives a request with an id 1 and a res object", () => {
    test("Then it should call Serie.find with property seen on false", () => {});
  });
});

describe("Given a createSerie function", () => {
  describe("When it receives a request with and object res and a next function", () => {
    test("Then it should respond with a 201 status and json the new serie", async () => {
      const res = {
        json: jest.fn(),
      };
      const got = {
        name: "gameofthrones",
        id: 1,
        platform: "netfli",
        seen: true,
        user: "test",
      };

      const req = { body: got };
      Serie.create = jest.fn().mockResolvedValue(got);

      await createSerie(req, res, null);

      expect(Serie.create).toHaveBeenCalledWith(got);
      expect(res.json).toHaveBeenCalledWith(got);
    });
  });
});

describe("Given an updateSerie function", () => {
  describe("When it receives a nonexistant serie", () => {
    test("Then it should call the next function with a 404 error", async () => {
      Serie.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          id: "3g3gwag3gag",
        },
      };

      const next = jest.fn();
      const expectedError = {
        code: 404,
        message: "Serie not found",
      };

      await updateSerie(req, null, next);
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives an existent serie", () => {
    test("Then it should call res.json() with the updated serie", async () => {
      const updatedSerie = {
        id: 1,
        name: "dark",
        seen: true,
        platform: "netflix",
      };
      Serie.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedSerie);

      const req = {
        body: {
          id: 1,
        },
      };

      const res = {
        json: jest.fn(),
      };
      await updateSerie(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedSerie);
    });
  });
});

describe("Given a deleteSerie controller", () => {
  describe("When it is invoked with a request with an id 2", () => {
    test("Then it should return the deleted robot in res.json", async () => {
      const res = {
        json: jest.fn(),
      };

      const got = {
        id: 2,
        name: "got",
        platform: "netfli",
        seen: true,
      };

      Serie.findByIdAndDelete = jest.fn().mockResolvedValue(got);
      const req = {
        body: {
          id: 2,
        },
      };
      await deleteSerie(req, res, null);

      expect(Serie.findByIdAndDelete).toHaveBeenCalledWith(got.id);
      expect(res.json).toHaveBeenCalledWith(got);
    });
  });
  describe("When it receives a non existant id", () => {
    test("Then it should invoke an error and call next function", async () => {
      Serie.findByIdAndDelete = jest.fn().mockResolvedValue({ id: 2 });
      const req = {
        body: {
          id: 1,
        },
      };

      const next = jest.fn();
      const expectedError = {
        code: 404,
        message: "Serie not found",
      };

      await updateSerie(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
