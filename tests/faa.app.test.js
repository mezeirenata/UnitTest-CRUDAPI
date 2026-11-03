const { response } = require("express");
const controller = require("../controllers/controller");
const Model = require("../models/model");
jest.mock("../models/model");
//mock the mongoose model with a mock, so we won't need a real MongoDB connection. | We mock a database model

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET books egységteszt", () => {
  const books = [
    {
      _id: 1,
      nev: "The bookest of books",
      szerzo_neve: "The author who is an author",
    },
  ];
  const req = {};

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  //1.
  test("The GET function exists", async () => {
    expect(controller.getBooks).toBeDefined();
    expect(typeof controller.getBooks).toBe("function");
  });

  // 2.
  test("The function returns all books successfully", async () => {
    Model.find.mockResolvedValue(books);

    await controller.getBooks(req, res);

    expect(res.json).toHaveBeenCalledWith(books);
  });

  // 3.
  test("The function returns the correct status code on success (200 OK)", async () => {
    Model.find.mockResolvedValue(books);

    await controller.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(books);
  });

  // 4.
  test("The function returns the correct status code when no books are found (404)", async () => {
    Model.find.mockResolvedValue(null);

    await controller.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 5.
  test("Returns an empty list when there are no books", async () => {
    Model.find.mockResolvedValue([]);

    await controller.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  // 6.
  test("Returns 500 when the database request fails", async () => {
    Model.find.mockRejectedValue(new Error("Database error"));

    await controller.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});


describe("DELETE books egységteszt", () => {
})


describe("POST books egységteszt", () => {
})
