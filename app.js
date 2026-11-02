
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
///////
mongoose.set('strictQuery', true)

const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString)
const database = mongoose.connection
database.on('error', (error) => {console.log(error)});

/// ha sikeres
database.once('connected', () => {console.log('Adatbázis csatlakoztatva')})

////
const routes = require('./routes/routes')
const app = express()

app.use(express.json())
app.use('/api',routes)

app.listen(3000, console.log('A szerver elindult...'))
