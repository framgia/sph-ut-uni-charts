import express from 'express'
import ProviderController from '../controllers/ProviderController'

const router = express.Router()
const Controller = new ProviderController()

router.post('/add', Controller.add)
router.get('/', Controller.getProviders)
router.get('/:id', Controller.filterListByProvider)

export default router
