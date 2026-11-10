
const controlBook = require('../controllers/controller');
const Model = require('../models/model');
const mongoose = require('mongoose')

jest.mock('../models/model');

beforeEach(() => {
    jest.clearAllMocks();
});

/// GET BOOK BY ID

describe('GET (by id) - megadott könyv kiolvasásának egységtesztje', () => {

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
    test('A függvény létezik (getBookById)', () => {
        expect(controlBook.getBookById).toBeDefined();
        expect(typeof controlBook.getBookById).toBe('function');
    });

    // 2. Meghívható-e a függvény?
    test('A függvény meghívható a megfelelő paraméterrel', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(Model.findById).toHaveBeenCalledWith('1');
    });
// paraméter vizsgálata
    // 3. Ha hiányzik az id paraméter
    test('A függvény hiányzó ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {}
        };

        await controlBook.getBookById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
        message: "Hiányzó ID paraméter"
        });
    })
    // 4. Ha hiányzik a request paraméter
    test('A függvény hiányzó paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        await controlBook.getBookById(null, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
        message: "Hiányzó paraméter"
        });
    })
    //5. Ha üres ID paramétert kapott
     test('A függvény üres ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {_id : ''}
        };
        await controlBook.getBookById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
        message: "Üres azonosító"
        });
    })

// Státuszkódok vizsgálata
    // 6. Sikeres visszatéréskor megfelelő-e a státuszkód?
    test('A függvény 200-as státuszkóddal tér vissza, amikor sikerül megtalálnia a könyvet', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    // 7. Nem talált könyv
    test('A függvény 404-es státuszkóddal tér vissza, ha nem létezik az adott azonosítóval könyv', async () => {
        Model.findById.mockResolvedValue(null);
        const req = {
            params: {_id : '2'}
        };
        await controlBook.getBookById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Könyv nem található a megadott azonosító alapján"
        })
    });
// Visszatérési érték vizsgálata
    //8. A függvény meghívja-e JSON küldést?
    test('A függvény visszaad adatot a válaszban sikeres találatkor', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.json).toHaveBeenCalled();
    });
    //9. Megfelelő-e a függvény visszatérési értéke?
    test('A függvény visszatér a helyes keresett könyvvel', async () => {
        Model.findById.mockResolvedValue(mockBook);

        await controlBook.getBookById(req, res);

        expect(res.json).toHaveBeenCalledWith(mockBook);
    });
// Adatbázishiba
    //10.
    test('A függvény 500-as státuszkódot ad adatbázishiba esetén', async () => {
        Model.findById.mockRejectedValue(new Error('Database error'));

        await controlBook.getBookById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

/// PUT

describe('PUT - könyv felülírásának egységtesztje', () => {

    // módosított könyv
    const mockModifiedBook = {
        nev: 'A kis herceg - módosított',
        szerzo_neve: 'Antoine de Saint-Exupéry',
        mufaj: 'Regény',
        keletkezes_eve: 1943,
        rovid_leiras: 'Módosított leírás.'
    };
    // req megszabása, res mockolása
    const req = {
        params: { _id: '1' },
        body: mockModifiedBook
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
    test('A függvény létezik (overrideBook)', () => {
        expect(controlBook.overrideBook).toBeDefined();
        expect(typeof controlBook.overrideBook).toBe('function');
    });

    // 2. Meghívható-e a függvény?
    test('A függvény meghívható a megfelelő paraméterrel', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockModifiedBook);

        await controlBook.overrideBook(req, res);

        expect(Model.findOneAndReplace).toHaveBeenCalled();
    });
// paraméter vizsgálata
    // 3. Ha hiányzik az id paraméter
    test('A függvény hiányzó ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {},
            body: mockModifiedBook
        };

        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Hiányzó ID paraméter"
        })
    })
    // 4. Ha hiányzik a request paraméter
    test('A függvény hiányzó paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        await controlBook.overrideBook(null, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Hiányzó paraméter"
        })
    })
    //5. Ha üres ID paramétert kapott
     test('A függvény üres ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {_id : ''},
            body: mockModifiedBook
        };
        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Üres azonosító"
        })
    })
    //6. Ha üres body-t kapott
    test('A függvény üres body esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: { _id: '1' },
            body: {}
        };

        await controlBook.overrideBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Hiányzó tartalom"
        })
    });
    //7. Ha nem kapott body-t
    test('A függvény 400-as státuszkóddal tér vissza, ha nem kapott body-t', async () => {
        const req = {
            params: { _id: '1' }
        };

        await controlBook.overrideBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Hiányzó tartalom"
        })
    }); 
    //8.a Ha hiányzik valamelyik mező
    test('A függvény hiányzó mező esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {_id : '1'},
            body: {
                nev: "alma"
            }
        };
        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    } )
    //8.b Ha ismeretlen mezők vannak megadva
      test('A függvény ismeretlen mező esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {_id : '1'},
            body: {
                 ...mockModifiedBook,
                 ismeretlen : "a"
            }
        };
        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( expect.objectContaining({
        message: "Nem létező mező!"
    }))
    } )
    //9.a Ha valamelyik mező hibás
    test('A függvény hibás típusú és üres érték esetén 400-as státuszkóddal tér vissza', async() => {
        Model.findOneAndReplace.mockRejectedValue(
            new mongoose.Error.CastError(
                'Number',
                'nemszám',
                'keletkezes_eve'
            )
        );
        const req = {
            params: {_id : '1'},
            body: {
                nev: 'A kis herceg - módosított',
                szerzo_neve: 'Antoine de Saint-Exupéry',
                mufaj: 'Regény',
                keletkezes_eve: "nemszám",
                rovid_leiras: 'Módosított leírás.'
            }
        };
        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( expect.objectContaining({
        message: "Hibás adatok!"
    }))
    })
    // 9.b Ha nem formátum hiba van hanem érték hiba
    test('A függvény határontúli érték esetén 400-as státuszkóddal tér vissza', async() => {
        Model.findOneAndReplace.mockRejectedValue(
            new mongoose.Error.CastError(
                'Number',
                -1,
                'keletkezes_eve'
            )
        );
        const req = {
            params: {_id : '1'},
            body: {
                nev: 'A kis herceg - módosított',
                szerzo_neve: 'Antoine de Saint-Exupéry',
                mufaj: 'Regény',
                keletkezes_eve: -1,
                rovid_leiras: 'Módosított leírás.'
            }
        };
        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( expect.objectContaining({
        message: "Hibás adatok!"
    }))
    })
// Státuszkódok vizsgálata
    // 10. Sikeres visszatéréskor megfelelő-e a státuszkód?
    test('A függvény 200-as státuszkóddal tér vissza, amikor sikerül módosítania a könyvet', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockModifiedBook);

        await controlBook.overrideBook(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
    // 11. Nem talált könyv
    test('A függvény 404-es státuszkóddal tér vissza, ha nem létezik az adott azonosítóval könyv', async () => {
        Model.findOneAndReplace.mockResolvedValue(null);
        const req = {
            params: {_id : '2'},
            body: mockModifiedBook
        };
        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Könyv nem található a megadott azonosító alapján"});
    });
    // Visszatérési érték vizsgálata
    //12. A függvény meghívja-e JSON küldést?
    test('A függvény visszaad adatot a válaszban sikeres találatkor', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockModifiedBook);

        await controlBook.overrideBook(req, res);

        expect(res.json).toHaveBeenCalled();
    });
    //13. Megfelelő-e a függvény visszatérési értéke?
    test('A függvény visszatér helyesen a módosított könyvvel', async () => {
        Model.findOneAndReplace.mockResolvedValue(mockModifiedBook);

        await controlBook.overrideBook(req, res);

        expect(res.json).toHaveBeenCalledWith(mockModifiedBook);
    });
// Adatbázishiba
    //14.
    test('A függvény 500-as státuszkódot ad adatbázishiba esetén', async () => {
        Model.findOneAndReplace.mockRejectedValue(new Error('Database error'));

        await controlBook.overrideBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
})

/// PATCH
describe('PATCH - könyv módosításának egységtesztje', () => {
    const mockPatch = {
        mufaj: 'Regény'
    }

    const mockModifiedBook = {
        nev: 'A kis herceg',
        szerzo_neve: 'Antoine de Saint-Exupéry',
        mufaj: 'Regény',
        keletkezes_eve: 1943,
        rovid_leiras: 'Egy kis herceg története.'
    };
    // req megszabása, res mockolása
    const req = {
        params: { _id: '1' },
        body: mockPatch
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
    test('A függvény létezik (updateBook)', () => {
        expect(controlBook.updateBook).toBeDefined();
        expect(typeof controlBook.updateBook).toBe('function');
    });

    // 2. Meghívható-e a függvény?
    test('A függvény meghívható a megfelelő paraméterrel', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockModifiedBook);

        await controlBook.updateBook(req, res);

        expect(Model.findByIdAndUpdate).toHaveBeenCalled();
    });
// paraméter vizsgálata
    // 3. Ha hiányzik az id paraméter
    test('A függvény hiányzó ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {},
            body: mockPatch
        };

        await controlBook.updateBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Hiányzó ID paraméter"})
    })
    // 4. Ha hiányzik a request paraméter
    test('A függvény hiányzó paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        await controlBook.updateBook(null, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Hiányzó paraméter"})
    })
    //5. Ha üres ID paramétert kapott
     test('A függvény üres ID paraméter esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {_id : ''},
            body: mockPatch
        };
        await controlBook.updateBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Üres azonosító"})
    })
    //6. Ha üres body-t kapott
    test('A függvény üres body esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: { _id: '1' },
            body: {}
        };

        await controlBook.updateBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Hiányzó tartalom"})
    });
    //7. Ha nem kapott body-t
    test('A függvény 400-as státuszkóddal tér vissza, ha nem kap body-t', async() => {
         const req = {
            params: { _id: '1' }
        };

        await controlBook.updateBook(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Hiányzó tartalom"})
    })
    //8.a Ha valamelyik mező hibás (rossz formátum)
    test('A függvény hibás típusú és üres érték esetén 400-as státuszkóddal tér vissza', async() => {
        Model.findByIdAndUpdate.mockRejectedValue(
            new mongoose.Error.CastError(
                'Number',
                'nemszám',
                'keletkezes_eve'
            )
        );
        const req = {
            params: {_id : '1'},
            body: {
                keletkezes_eve: "nemszám",
            }
        };
        await controlBook.updateBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( expect.objectContaining({
        message: "Hibás adatok!"
    }))
    })
    //8.b Ha valamelyik mező helytelen értéket kapott
    test('A függvény hibás típusú és üres érték esetén 400-as státuszkóddal tér vissza', async() => {
        Model.findByIdAndUpdate.mockRejectedValue(
            new mongoose.Error.CastError(
                'Number',
                -1,
                'keletkezes_eve'
            )
        );
        const req = {
            params: {_id : '1'},
            body: {
                keletkezes_eve: -1,
            }
        };
        await controlBook.updateBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( expect.objectContaining({
        message: "Hibás adatok!"
        }))
    })
    //8.c Ha ismeretlen  mezők vannak megadva
      test('A függvény ismeretlen mező esetén 400-as státuszkóddal tér vissza', async () => {
        const req = {
            params: {_id : '1'},
            body: {
                 ismeretlen : "a"
            }
        };
        await controlBook.overrideBook(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith( expect.objectContaining({
            message: "Nem létező mező!"
        }))
    })
// Státuszkódok vizsgálata
    // 9. Sikeres visszatéréskor megfelelő-e a státuszkód?
    test('A függvény 200-as státuszkóddal tér vissza, amikor sikerül módosítania a könyvet', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockModifiedBook);

        await controlBook.updateBook(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    })
    // 10. Nem talált könyv
    test('A függvény 404-es státuszkóddal tér vissza, ha nem létezik az adott azonosítóval könyv', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(null);
        const req = {
            params: {_id : '2'},
            body: mockPatch
        };
        await controlBook.updateBook(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Könyv nem található a megadott azonosító alapján"})
    })
// Visszatérési érték vizsgálata
    //11. Megfelelő mezőket módosítja?
    test('A függvény csak a megadott mezőket módosítja', async () => {

        Model.findByIdAndUpdate.mockResolvedValue(mockModifiedBook);

        await controlBook.updateBook(req, res);

        expect(Model.findByIdAndUpdate).toHaveBeenCalledWith(
            '1',
            mockPatch,
            expect.objectContaining({ returnDocument: 'after',
            runValidators: true})
        );
        expect(res.json).toHaveBeenCalledWith(mockModifiedBook);
    })
    //12. A függvény meghívja-e JSON küldést?
    test('A függvény visszaad adatot a válaszban sikeres találatkor', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockModifiedBook);

        await controlBook.updateBook(req, res);

        expect(res.json).toHaveBeenCalled();
    })
    //13. Megfelelő-e a függvény visszatérési értéke?
    test('A függvény visszatér helyesen a módosított könyvvel', async () => {
        Model.findByIdAndUpdate.mockResolvedValue(mockModifiedBook);

        await controlBook.updateBook(req, res);

        expect(res.json).toHaveBeenCalledWith(mockModifiedBook);
    })
// Adatbázishiba
    //14.
    test('A függvény 500-as státuszkódot ad adatbázishiba esetén', async () => {
        Model.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

        await controlBook.updateBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    })
})