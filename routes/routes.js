const express = require('express')
const controlBook = require('../controllers/controller');
const router = express.Router()

// POST
router.post('/books', controlBook.createBook)

// GET ALL
router.get('/books', controlBook.getBooks)

// GET BY ID
router.get('/books/:id', controlBook.getBookById)

// PATCH
router.patch('/books/:id', controlBook.updateBook)

// PUT
router.put('/books/:id', controlBook.overrideBook)

// DELETE
router.delete('/books/:id', controlBook.deleteBook)

module.exports = router