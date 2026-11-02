const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  _id: Number,
  nev: String,
  szerzo_neve: String,
  mufaj: String,
  keletkezes_eve: Number,
  rovid_leiras: String
});

module.exports = mongoose.model('Book', bookSchema, 'books')