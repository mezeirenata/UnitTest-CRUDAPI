const express = require('express')
const controlBook = require('../controllers/controller');
const router = express.Router()

// POST
router.post('/', controlBook.createBook)

// GET ALL
router.get('/', controlBook.getBooks)

// GET BY ID
router.get('/:id', controlBook.getBookById)

// PATCH
router.patch('/:id', controlBook.updateBook)

// PUT
router.post('/', controlBook.overrideBook)

// DELETE
router.delete('/:id', controlBook.deleteBook)

module.exports = router