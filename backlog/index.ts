import express from 'express'
// import cors from 'cors'
const app = express()
const cors = require('cors')
const testRoutes = require('./routes/test')
const ProviderRoutes = require('./routes/Provider')
const PORT = process.env.PORT || 12000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log(`Server is online at port ${PORT}`)
})

// optional, to check response on localhost
app.get('/', (req: any, res: any) => {
  res.send('Server is online')
})

app.use(cors())
app.use('/api', testRoutes)
app.use('/api/providers', ProviderRoutes)
