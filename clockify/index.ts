import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import cors from 'cors'
import bodyParser from 'body-parser'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 13000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

app.listen(PORT, () => {
  console.log(`Server is online at port ${PORT}`)
})

// optional, to check response on localhost
app.get('/', (req: Request, res: Response) => {
  res.send('Server is online')
})

app.use(cors())
app.use('/api', routes)
