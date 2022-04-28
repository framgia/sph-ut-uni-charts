import express from 'express'
import BacklogController from '../controllers/BacklogController'

const router = express.Router()
const Backlog = new BacklogController()

router.get('/projects', Backlog.getList)

export default router
