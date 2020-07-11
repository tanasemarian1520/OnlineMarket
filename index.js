const bodyParser = require('body-parser')
const cluster = require('cluster')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')

const apiPort = process.env.PORT || 3001
const app = express()

require('dotenv').config({ path: `${__dirname}/.env` })
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads/', express.static('uploads'))
app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

// ROUTES

const auth = require('./routes/auth')
const product = require('./routes/product')
app.use('/api', auth)
app.use('/api/product', product)

// CONNECT DB

const db = require('./db')

// BUILD THE CLIENT SIDE

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

let server = app.listen(apiPort, () => console.log(`app running on port ${apiPort}...`))

module.exports = server
