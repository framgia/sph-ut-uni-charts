require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const testRoutes = require('./routes/test')
const userRoutes = require('./routes/user')
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT || 14000, () => {
  console.log(`Server is online at port ${PORT}`)
})

// optional, to check response on localhost
app.get('/', (req, res) => {
  res.send('Server is online')
})

app.use(cors())
app.use('/api/tests', testRoutes)
app.use('/api/users', userRoutes)
