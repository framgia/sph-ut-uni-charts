import express from 'express'
import UserController from '../controllers/UserController'

const router = express.Router()

router.post('/signIn', UserController.signIn)
router.post('/signOut', UserController.signOut)
router.get('/check-status', UserController.checkStatus)

export default router
