require('dotenv').config()
import express, { Request, Response } from 'express'
import cors from 'cors'
import AccountRoute from './routes/AccountRoute'
import ProviderRoutes from './routes/ProviderRoute'
import ProjectRoutes from './routes/ProjectRoute'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is online at ${PORT}`)
  })
} else {
  app.listen(11001)
}

app.get('/', (req: Request, res: Response) => {
  res.send('Server is online.')
})

app.use(cors())
app.use('/api/providers', ProviderRoutes)
app.use('/api/projects', ProjectRoutes)
app.use('/api/account', AccountRoute)
export default app
