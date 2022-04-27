require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const testRoutes = require('./routes/test')
const userRoutes = require('./routes/user')
const providerRoutes = require('./routes/provider')
const PORT = process.env.PORT || 11000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log(`Server is online at port ${PORT}`)
})

// optional, to check response on localhost
app.get('/', (req, res) => {
  res.status(200).send('BFF server is online.')
})

app.use(cors())
app.use('/api/tests', testRoutes)
app.use('/api/users', userRoutes)

module.exports = app
