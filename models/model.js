const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  nev: {
    type: String,
    required: [true, "Könyv címének megadása kötelező!"],
    trim: true
  },
  szerzo_neve:
  {
    type: String,
    required: [true, "Szerző nevének megadása kötelező!"],
    trim: true
  }, 
  mufaj:{
    type:String,
    required:[true, "Műfaj megadása kötelező!"],
    trim: true
  },
  keletkezes_eve:{
    type: Number,
    required: [true, "Keletkezés évének megadása kötelező!"],
    min: [1, "Az év nem lehet 0 vagy negatív!"],
    max: [new Date().getFullYear(), "A keletkezés éve nem lehet jövőbeli!"]
  }, 
  rovid_leiras:{
    type:String,
    trim: true
  }

});

module.exports = mongoose.model('Book', bookSchema, 'books')