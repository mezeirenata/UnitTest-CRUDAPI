
const controlBook = require('../controllers/controller');
const Model = require('../models/model');
jest.mock('../models/model');


beforeEach(() => {
    jest.clearAllMocks();
});

// hiányzik a body? hiányzik-e az id, mivan ha nem hiányzik és jó
// +todo: a kapott érték validálása (paramétr)
// jó és rossz megnézése
// a függvény megfelelő típusú adatot adott vissza
// a függvény adott vissza valamit
// should return json body in response

/// GET BOOK BY ID

describe('GET (by id) egységteszt', () => {

    const mockBook = {
        _id: 1,
        nev: 'A kis herceg',
        szerzo_neve: 'Antoine de Saint-Exupéry',
        mufaj: 'Mese',
        keletkezes_eve: 1943,
        rovid_leiras: 'Egy kis herceg bolygóról bolygóra utazik, miközben barátságról, szeretetről és az élet fontos értékeiről tanul.'
    };

    const req = {
        params: { id: '1' }
    };

    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // 1. Létezik-e a függvény?
    test('A függvény létezik', () => {
        expect(controlBook.getBookById).toBeDefined();
        expect(typeof controlBook.getBookById).toBe('function');
    });

    // 2. Meghívható-e a függvény?
    test('A függvény meghívható', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(Model.findById).toHaveBeenCalled();
    });

    // 3. Megfelelő paraméterrel hívja-e meg a Modelt?
    test('A függvény megfelelő (és 1 darab) paramétert kapott (id-t) ', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(Model.findById).toHaveBeenCalledWith('1');
    });

    // 4. Megfelelő státuszkód?
    test('A függvény 200-as státuszkóddal tér vissza, amikor sikerül megtalálnia a könyvet', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    // 5. Adatok validálása
    test('A függvény 404-es státuszkóddal tér vissza, ha nem sikerül megtalálnia a könyvet a megadott id alapján', async () => {
        Model.findById.mockResolvedValue(null);

        await controlBook.getBookById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // 6. Megfelelő válasz?
    test('A függvény megfelelő válasszal tér vissza', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    
});


// ==========================================
// PUT - OVERRIDE BOOK
// ==========================================

describe('PUT BOOK - Unit Tests', () => {

    const mockBook = {
        _id: 1,
        title: 'New title',
        author: 'New author'
    };

    const req = {
        params: { id: '1' },
        body: {
            title: 'New title',
            author: 'New author'
        }
    };

    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // 1. Létezik-e a függvény?
    test('1. overrideBook function exists', () => {
        expect(controlBook.overrideBook).toBeDefined();
        expect(typeof controlBook.overrideBook).toBe('function');
    });

    // 2. Meghívható-e?
    test('2. overrideBook can be called', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockBook);

        await controlBook.overrideBook(req, res);

        expect(Model.findOneAndReplace).toHaveBeenCalled();
    });

    // 3. Helyes paramétereket kap-e?
    test('3. Model.findOneAndReplace receives correct parameters', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockBook);

        await controlBook.overrideBook(req, res);

        expect(Model.findOneAndReplace).toHaveBeenCalledWith(
            { _id: '1' },
            req.body,
            { new: true }
        );
    });

    // 4. Helyes státuszkód?
    test('4. Returns status 200 when book is replaced', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockBook);

        await controlBook.overrideBook(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    // 5. Nem létező könyv kezelése
    test('5. Returns 404 when book does not exist', async () => {
        Model.findOneAndReplace.mockResolvedValue(null);

        await controlBook.overrideBook(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // 6. Megfelelő választ ad-e?
    test('6. Returns the replaced book', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockBook);

        await controlBook.overrideBook(req, res);

        expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    // Extra: adatbázishiba
    test('Returns 500 when database error occurs', async () => {
        Model.findOneAndReplace.mockRejectedValue(
            new Error('Database error')
        );

        await controlBook.overrideBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});


// ==========================================
// PATCH - UPDATE BOOK
// ==========================================

describe('PATCH BOOK - Unit Tests', () => {

    const mockBook = {
        _id: 1,
        title: 'Updated title',
        author: 'J.R.R. Tolkien'
    };

    const req = {
        params: { id: '1' },
        body: {
            title: 'Updated title'
        }
    };

    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // 1. Létezik-e a függvény?
    test('1. updateBook function exists', () => {
        expect(controlBook.updateBook).toBeDefined();
        expect(typeof controlBook.updateBook).toBe('function');
    });

    // 2. Meghívható-e?
    test('2. updateBook can be called', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockBook);

        await controlBook.updateBook(req, res);

        expect(Model.findByIdAndUpdate).toHaveBeenCalled();
    });

    // 3. Megfelelő paraméterekkel hívja-e a Modelt?
    test('3. Model.findByIdAndUpdate receives correct parameters', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockBook);

        await controlBook.updateBook(req, res);

        expect(Model.findByIdAndUpdate).toHaveBeenCalledWith(
            '1',
            req.body,
            { new: true }
        );
    });

    // 4. Megfelelő státuszkód?
    test('4. Returns status 200 when book is updated', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockBook);

        await controlBook.updateBook(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    // 5. Nem létező könyv kezelése
    test('5. Returns 404 when book does not exist', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(null);

        await controlBook.updateBook(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // 6. Megfelelő választ ad-e?
    test('6. Returns the updated book', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockBook);

        await controlBook.updateBook(req, res);

        expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    // Extra: adatbázishiba
    test('Returns 500 when database error occurs', async () => {
        Model.findByIdAndUpdate.mockRejectedValue(
            new Error('Database error')
        );

        await controlBook.updateBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
