import express from 'express'
import WebhookController from '../controllers/WebhookController'

const router = express.Router()
const Controller = new WebhookController()

// get all data from Test Table
router.post('/webhook', Controller.getData)

export default router
