require('dotenv').config()
import express, { Request, Response } from 'express'
import cors from 'cors'
import userRoute from './routes/userRoute'
const { queryParser } = require('express-query-parser')

const app = express()
const PORT = process.env.PORT || 14000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is online at ${PORT}`)
  })
}

app.get('/', (req: Request, res: Response) => {
  res.send('Server is onlines')
})

app.use(cors())
app.use('/api/users', userRoute)

export default app
