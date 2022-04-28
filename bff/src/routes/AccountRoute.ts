import express from 'express'
import AccountController from '../controllers/AccountController'

const router = express.Router()
router.post('/sign-in', AccountController.login)
router.post('/sign-out', AccountController.logout)
router.get('/active-status', AccountController.checkActiveStatus)

export default router
