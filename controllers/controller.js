const Model = require('../models/model')

const allowedFields = [
    'nev',
    'szerzo_neve',
    'mufaj',
    'keletkezes_eve',
    'rovid_leiras'
];


/// POST
module.exports.createBook = async (req, res) => {
    try {
        if (!req) {
            return res.status(400).json({ message: "Hiányzó paraméter" });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Hiányzó tartalom" });
        }

        const invalidFields = Object.keys(req.body).filter(
        field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: 'Nem létező mező!',
                fields: invalidFields
            });
        }

        // Kötelező mezők
        const requiredFields = [
            'nev',
            'szerzo_neve',
            'mufaj',
            'keletkezes_eve'
        ];

        const missingFields = requiredFields.filter(
            field => req.body[field] === undefined
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Hiányzó mezők",
                missingFields
            });
        }

        // Új könyv létrehozása
        const uploadedBook = await Model.create(req.body);

        return res.status(201).json(uploadedBook);
    }
    catch (error) {
        if (
            error.name === 'ValidationError' ||
            error.name === 'CastError'
        ) {
            return res.status(400).json({
                message: "Hibás adatok!",
                error: error.message
            });
        }

        return res.status(500).json({ message: "Szerver hiba" });
    }
};

/// GET ALL
module.exports.getBooks = async(res)=> {
    try{
        const books = await Model.find();
        if (!books){
            return res.status(404).json({ message: "A gyűjtemény nem található" });
        }
        res.status(200).json(books);
    }
    catch(error){
        // console.log(error);

        res.status(500).json({ message: "Szerver hiba" });;
    }
}

/// GET BY ID
module.exports.getBookById = async (req, res) => {
    try {
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || req.params._id === undefined || req.params._id === null) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params._id.trim() == '') return res.status(400).json({message: "Üres azonosító"})

        const book = await Model.findById(req.params._id);
        if (!book) {
            return res.status(404).json({ message: "Könyv nem található a megadott azonosító alapján" });
        }
        res.status(200).json(book);
    }
    catch (error) {
        // console.log(error);

        res.status(500).json({ message: "Szerver hiba" });
    }
}

/// PATCH csak a megadott mezőket cseréli
module.exports.updateBook = async (req, res) => {
    try {
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || req.params._id === undefined || req.params._id === null) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params._id.trim() == '') return res.status(400).json({message: "Üres azonosító"})
    ///  req.body validálás
        if (!req.body || Object.keys(req.body).length == 0) return res.status(400).json({message: "Hiányzó tartalom"})
        
        const invalidFields = Object.keys(req.body).filter(
        field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: 'Nem létező mező!',
                fields: invalidFields
            });
        }

        
        const updatedBook = await Model.findByIdAndUpdate(
            req.params._id,
            req.body,
            { returnDocument: 'after',
            runValidators:true
            }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Könyv nem található a megadott azonosító alapján" });
        }

        res.status(200).json(updatedBook);
    }
    catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError'){
            return res.status(400).json({
            message: "Hibás adatok!",
            error: error.message
        });
        }

        res.status(500).json({ message: "Szerver hiba" });
    }
}

/// PUT felülírja az egész könyvet, aminek az azonosítója megegyezik
module.exports.overrideBook = async(req,res) => {
    try{
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || req.params._id === undefined || req.params._id === null) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params._id.trim() == '') return res.status(400).json({message: "Üres azonosító"})
    // req.body validálás
        if (!req.body || Object.keys(req.body).length == 0) return res.status(400).json({message: "Hiányzó tartalom"})
    // rossz mező
        const invalidFields = Object.keys(req.body).filter(
        field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: 'Nem létező mező!',
                fields: invalidFields
            });
        }

    // Kötelező mezők
        const requiredFields = [
            'nev',
            'szerzo_neve',
            'mufaj',
            'keletkezes_eve'
        ];

        // Hiányzó mezők ellenőrzése
        const missingFields = requiredFields.filter(
            field => req.body[field] === undefined
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Hiányzó mezők",
                missingFields
            });
        }

        const updatedBook = await Model.findOneAndReplace(
            { _id: req.params._id },
            req.body,
            { returnDocument: 'after',
                runValidators:true
            }
        ); 

        if (!updatedBook) {
            return res.status(404).json({ message: "Könyv nem található a megadott azonosító alapján" });
        }

        res.status(200).json(updatedBook);
    }
    catch(error){
        if (error.name === 'ValidationError' || error.name === 'CastError'){
            return res.status(400).json({
            message: "Hibás adatok!",
            error: error.message
        });
        }

        res.status(500).json({ message: "Szerver hiba" });
    }
}

/// DELETE
module.exports.deleteBook = async(req,res) => {
    try{
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || req.params._id === undefined || req.params._id === null) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params._id.trim() == '') return res.status(400).json({message: "Üres azonosító"})

        const deletedBook = await Model.findByIdAndDelete(req.params._id);
        if(!deletedBook){
            return res.status(404).json({message: "Könyv nem található a megadott azonosító alapján"});
        }
        res.status(200).json({message: "Sikeres törlés"});
    }
    catch (error){
        // console.log(error);

        res.status(500).json({message: "Szerver hiba"});
    }
}