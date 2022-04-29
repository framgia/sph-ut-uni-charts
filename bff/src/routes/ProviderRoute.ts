import express from 'express'
import ProviderController from '../controllers/ProviderController'

const router = express.Router()
router.post('/add', ProviderController.add)
router.get('/', ProviderController.getProviders)

export default router
