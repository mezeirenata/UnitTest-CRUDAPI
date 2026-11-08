

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

// hiányzik a body? hiányzik-e az id, mivan ha nem hiányzik és jó
// +todo: a kapott érték validálása (paramétr)
// jó és rossz megnézése
// a függvény megfelelő típusú adatot adott vissza
// a függvény adott vissza valamit
// should return json body in response
