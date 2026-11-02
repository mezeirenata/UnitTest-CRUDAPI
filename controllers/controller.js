const Model = require('../models/model')

module.exports.createMember = async (req, res)=>{
    try{
        const newBook = await Model.create(req.body)
        res.status(201).json(newBook)
    }
    catch(error){
        console.log(error);
        res.status(500);
    }
}

// module.exports.getBook = async(req,res) => {
//     try {
//         const Books = await Model. 
//     }
// }