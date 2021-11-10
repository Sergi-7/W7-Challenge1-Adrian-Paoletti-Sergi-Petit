const Serie = require("../../database/models/serie");
const {
  getSeries,
  getViewedSeries,
  getPendingSeries,
  deleteSerie,
  updateSerie,
  toggleSerie,
  createSerie,
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
