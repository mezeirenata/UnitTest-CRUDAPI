
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

///////
mongoose.set('strictQuery', true)

const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString)
const database = mongoose.connection

/// ha hiba lépett fel
database.on('error', (error) => {console.log(error)});

/// ha sikeres a csatlakozás
database.once('connected', () => {console.log('Adatbázis csatlakoztatva')})

///////
const routes = require('./routes/routes')
const app = express()

app.use(express.json())
app.use('/api',routes)

app.get('/test', (req, res) => {
    res.send('Express is working!');
});

app.listen(3000, console.log('A szerver elindult...'))

/// extension name: Flashpost