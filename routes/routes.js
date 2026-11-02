const express = require('express')
const createBook = require('../controllers/controller')
const router = express.Router()

// Útválasztások
router.post('/', createBook.createMember)
router.get('/', (req, res)=>{
    res.send('Get API')
})

router.get('/:id', (req, res)=>{
    res.send('GET API')
})

router.delete('/:id', (req, res)=>{
    res.send('Delete API')
})

router.patch('/:id', (req, res)=>{
    res.send('Patch API')
})


module.exports = router