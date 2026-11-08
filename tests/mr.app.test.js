
const controlBook = require('../controllers/controller');
const Model = require('../models/model');
jest.mock('../models/model');

beforeEach(() => {
    jest.clearAllMocks();
});

/// GET BOOK BY ID

describe('GET (by id) egységteszt', () => {

    // keresett visszatérési érték
    const mockBook = {
        nev: 'A kis herceg',
        szerzo_neve: 'Antoine de Saint-Exupéry',
        mufaj: 'Mese',
        keletkezes_eve: 1943,
        rovid_leiras: 'Egy kis herceg bolygóról bolygóra utazik, miközben barátságról, szeretetről és az élet fontos értékeiről tanul.'
    };

    // req megszabása, res mockolása
    const req = {
        params: { _id: '1' }
    };

    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

// függvény vizsgálata
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
// paraméter vizsgálata
    // 3. A függvény megfelelő meghívása
    test('A függvény meg lett hívva a megadott paraméterrel', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(Model.findById).toHaveBeenCalledTimes(1);
        expect(Model.findById).toHaveBeenCalledWith(req);
    });
    // 4. Ha hiányzik az id paraméter
    test('A függvény hiányzó ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {}
        };

        await controlBook.getBookById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    })
    // 5. Ha hiányzik maga a paraméter
    test('A függvény hiányzó paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        await controlBook.getBookById(null, res);
        expect(res.status).toHaveBeenCalledWith(400);
    })
    //6. Ha üres ID paramétert kapott
     test('A függvény üres ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {_id : ''}
        };
        await controlBook.getBookById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    })

// Státuszkódok vizsgálata
    // 7. Sikeres visszatéréskor megfelelő-e a státuszkód?
    test('A függvény 200-as státuszkóddal tér vissza, amikor sikerül megtalálnia a könyvet', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    // 8. Nem talált könyv
    test('A függvény 404-es státuszkóddal tér vissza, ha nem sikerül megtalálnia a könyvet a megadott id alapján', async () => {
        Model.findById.mockResolvedValue(null);
        const req = {
            params: {_id : '2'}
        };
        await controlBook.getBookById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
// Visszatérési érték vizsgálata
    //7. A függvény visszatér-e megfelelő típusú válasszal
    test('A függvény visszaad adatot a válaszban sikeres találatkor', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.json).toHaveBeenCalled();
    });
    //8. Megfelelő-e a függvény visszatérési értéke?
    test('A függvény visszatér a helyes keresett könyvvel', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.json).toHaveBeenCalledWith(mockBook);
    });
    
});

