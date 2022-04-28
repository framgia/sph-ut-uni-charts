require('dotenv').config()
import express, { Request, Response } from 'express'
import ProjectRoutes from './routes/ProjectRoute'
import ProviderRoutes from './routes/ProviderRoute'
import BacklogRoutes from './routes/BacklogRoutes'

const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 12000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is online at ${PORT}`)
  })
} else {
  app.listen(12001)
}

app.get('/', (req: Request, res: Response) => {
  res.send('Server is online')
})

app.use(cors())
app.use('/api/projects', ProjectRoutes)
app.use('/api/providers', ProviderRoutes)
app.use('/api/backlog', BacklogRoutes)
