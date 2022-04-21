require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const ProviderRoutes = require('./routes/provider')
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT || 12000, () => {
    console.log(`Server is online at port ${PORT}`)
  })
}

// optional, to check response on localhost
app.get('/', (req, res) => {
  res.send('Server is online')
})

app.use(cors())
app.use('/api/providers', ProviderRoutes)
