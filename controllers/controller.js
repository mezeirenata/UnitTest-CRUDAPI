const Model = require('../models/model')

/// POST
module.exports.createBook = async (req, res)=>{
    try{
        // req. body validálás: jó típusú változók, meg vane adva mindegyik változó, ha üres a request, ha nem kapott requestet mint paraméter
        const newBook = await Model.create(req.body)
        res.status(201).json(newBook)
    }
    catch(error){
        console.log(error);
        res.status(500);
    }
}

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
        console.log(error);
        res.status(500);
    }
}


/// GET BY ID
module.exports.getBookById = async (req, res) => {
    try {
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || !req.params.id) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params.id.trim() == '') return res.status(400).json({message: "Üres azonosító"})

        const book = await Model.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Könyv nem található a megadott azonosító alapján" });
        }
        res.status(200).json(book);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Szerver hiba" });
    }
}

/// PATCH csak a megadott mezőket cseréli
module.exports.updateBook = async (req, res) => {
    try {
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || !req.params.id) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params.id.trim() == '') return res.status(400).json({message: "Üres azonosító"})
        /// todo: req.body validálás
        
        const updatedBook = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Könyv nem található" });
        }

        res.status(200).json(updatedBook);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Szerver hiba" });
    }
}

/// PUT felülírja az egész könyvet, aminek az azonosítója megegyezik
module.exports.overrideBook = async(req,res) => {
    try{
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || !req.params.id) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params.id.trim() == '') return res.status(400).json({message: "Üres azonosító"})
        // todo: req.body validálás
        const updatedBook = await Model.findOneAndReplace(
            { _id: req.params.id },
            req.body,
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Könyv nem található a megadott azonosító alapján" });
        }

        res.status(200).json(updatedBook);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Szerver hiba" });
    }
}

/// DELETE
module.exports.deleteBook = async(req,res) => {
    try{
        if (!req) return res.status(400).json({message: "Hiányzó paraméter"})
        if (!req.params || !req.params.id) return res.status(400).json({message: "Hiányzó ID paraméter"})
        if (req.params.id.trim() == '') return res.status(400).json({message: "Üres azonosító"})

        const deletedBook = await Model.findByIdAndDelete(req.params.id);
        if(!deletedBook){
            return res.status(404).json({message: "Könyv nem található a megadott azonosító alapján"});
        }
        res.status(200).json({message: "Sikeres törlés"});
    }
    catch (error){
        console.log(error);
        res.status(500).json({message: "Szerver hiba"});
    }
}