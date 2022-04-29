import express from 'express'
import ProviderController from '../controllers/ProviderController'

const router = express.Router()
const Provider = new ProviderController()

router.post('/add', Provider.add)
router.get('/', Provider.getProviders)

export default router
