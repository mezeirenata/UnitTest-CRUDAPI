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
      nev: "Name of Book",
      szerzo_neve: "Author of Book",
    },
  ];
  // const req = {};

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  //1.
  test("A getBooks függvény létezik", async () => {
    expect(controller.getBooks).toBeDefined();
    expect(typeof controller.getBooks).toBe("function");
  });

  //2.
  test("A getBooks függvény egy listát ad vissza", async () => {
    Model.find.mockResolvedValue(books);

    await controller.getBooks(res);

    const returnedBooks = res.json.mock.calls[0][0];
    //json hívásai. #1 -> első hívás, #0 -> első argumentum (a lista)

    expect(Array.isArray(returnedBooks)).toBe(true);
  });

  // 3.
  test("A getBooks függvény sikeresen visszaadja az összes könyvet", async () => {
    Model.find.mockResolvedValue(books);

    await controller.getBooks(res);

    expect(res.json).toHaveBeenCalledWith(books);
  });

  // 4.
  test("A getBooks függvény sikeresen visszaadja az összes könyvet a megfelelő státuszkóddal (200)", async () => {
    Model.find.mockResolvedValue(books);

    await controller.getBooks(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(books);
  });

  // 5.
  test("A getBooks függvény sikeresen visszaadja a 404-es státuszkódot, ha a gyűjtemény nem található", async () => {
    Model.find.mockResolvedValue(null);

    await controller.getBooks(res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 6.
  test("A getBooks függvény sikeresen visszaadja az üres listát, ha nincs könyv", async () => {
    Model.find.mockResolvedValue([]);

    await controller.getBooks(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  // 7 .
  test("A getBooks függvény 500-as státuszkóddal tér vissza, ha az adatbázis kérés sikertelen", async () => {
    Model.find.mockRejectedValue(new Error("Database error"));

    await controller.getBooks(res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("DELETE books egységteszt", () => {
  const mockBook = {
    _id: 5,
  };

  const req = {
    params: {
      _id: "5",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // 1.
  test("A deleteBook függvény létezik", async () => {
    expect(controller.deleteBook).toBeDefined();
    expect(typeof controller.deleteBook).toBe("function");
  });

  // 2.
  test("A deleteBook függvény sikeresen törli a könyvet, és visszaadja a 200-as státuszkódot", async () => {
    Model.findByIdAndDelete.mockResolvedValue(mockBook);

    await controller.deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sikeres törlés",
    });
  });

  // 3.
  test("A deleteBook függvény sikeresen visszaadja a 404-es státuszkódot, ha a könyv nem található", async () => {
    Model.findByIdAndDelete.mockResolvedValue(null);

    await controller.deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Könyv nem található a megadott azonosító alapján",
    });
  });

  //4.
  test("A deleteBook függvény sikeresen visszaadja a 400-as státuszkódot, ha az azonosító hiányzik", async () => {
    const missingIdReq = {
      params: {},
    };

    await controller.deleteBook(missingIdReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Model.findByIdAndDelete).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Hiányzó ID paraméter",
    });
  });

  // 5
  test("A deleteBook függvény sikeresen visszaadja a 400-as státuszkódot, ha az azonosító üres", async () => {
    const nullIdReq = {
      params: { _id: "" },
    };

    await controller.deleteBook(nullIdReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Model.findByIdAndDelete).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Üres azonosító",
    });
  });

  // 6
  test("A deleteBook függvény sikeresen visszaadja a 400-as státuszkódot, ha a kérés nem definiált", async () => {
    await controller.deleteBook(undefined, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Model.findByIdAndDelete).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Hiányzó paraméter",
    });
  });

  // 7
  test("A deleteBook függvény sikeresen visszaadja a 500-as státuszkódot, ha az adatbázis kérés sikertelen", async () => {
    Model.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

    await controller.deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Szerver hiba",
    });
  });
});

describe("POST books egységteszt", () => {
  const req = {
    body: {
      nev: "Silktouch in the wind",
      szerzo_neve: "Stalingrad",
      mufaj: "Krimi",
      keletkezes_eve: "1988",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // 1.
  test("A createBook függvény létezik", async () => {
    expect(controller.createBook).toBeDefined();
    expect(typeof controller.createBook).toBe("function");
  });

  //2.
  test("A createBook függvény sikeresen feltölt egy könyvet, és visszaadja a 201-es státuszkódot", async () => {
    Model.create.mockResolvedValue(req.body);

    await controller.createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
    expect(Model.create).toHaveBeenCalledWith(req.body);
  });

  // 3.
  test("A createBook függvény visszaadja a 400-as státuszkódot, ha a kérés hiányzik", async () => {
    Model.create.mockResolvedValue(req.body);

    await controller.createBook(undefined, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Hiányzó paraméter",
    });
  });

  // 4.
  test("A createBook függvény visszaadja a 400-as státuszkódot, ha a kérés nincs megadva, vagy üres", async () => {
    const NoBodyreq = {};
    const EmptyBodyreq = { body: {} };
    Model.create.mockResolvedValue(req.body);

    await controller.createBook(NoBodyreq, res);
    await controller.createBook(EmptyBodyreq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Hiányzó tartalom" });
  });

  // 5.
  test("A createBook függvény visszaadja a 400-as státuszkódot, ha a kérés tartalma hiányos", async () => {
    const req = {
      body: {
        nev: "Silktouch in the wind",
        szerzo_neve: "Stalingrad",
        mufaj: "Krimi",
        // keletkezes_eve is missing
      },
    };

    Model.create.mockResolvedValue(req.body);

    await controller.createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Hiányzó mezők",
        missingFields: expect.arrayContaining(["keletkezes_eve"]),
      }),
    );
  });

  // 6.a
  test("A createBook függvény visszaadja a 400-as státuszkódot, ha az egyik mező tartalma hibás típusú", async () => {
    const invalidReq = {
      body: {
        nev: "Silktouch in the wind",
        szerzo_neve: "Stalingrad",
        mufaj: "Krimi",
        keletkezes_eve: "nem év",
      },
    };
    const castError = new Error("Invalid type");
    castError.name = "CastError";

    Model.create.mockRejectedValue(castError);

    await controller.createBook(invalidReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Hibás adatok!",
      }),
    );
  });
  // 6.b
    test("A createBook függvény visszaadja a 400-as státuszkódot, ha az egyik mező ismeretlen", async () => {
    const invalidReq = {
      body: {
        nev: "Silktouch in the wind",
        szerzo_neve: "Stalingrad",
        mufaj: "Krimi",
        keletkezes_eve: 2000,
        ismeretlen: "a"
      },
    };

    await controller.createBook(invalidReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Nem létező mező!",
      }),
    );
  });
  // 7 .
  test("A createBook függvény visszaadja a 500-as státuszkódot, ha az adatbázis kérés sikertelen", async () => {
    Model.create.mockRejectedValue(new Error("Database error"));

    await controller.createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Szerver hiba" });
  });

  //8. Megfelelő-e a függvény visszatérési értéke?
  test("A createBook függvény helyesen adja vissza a feltöltött könyvet", async () => {
    Model.create.mockResolvedValue(req.body);

    await controller.createBook(req, res);

    expect(res.json).toHaveBeenCalledWith(req.body);
  });
});
