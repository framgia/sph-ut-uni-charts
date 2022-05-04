import express from 'express'
import ProviderController from '../controllers/ProviderController'

const router = express.Router()
const Provider = new ProviderController()

router.get('/', Provider.getProviders)
router.post('/add', Provider.add)
router.get('/:id', Provider.getProviderById)

export default router
