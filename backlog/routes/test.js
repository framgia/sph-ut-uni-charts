const express = require('express')
const router = express.Router()
const TestController = require('../controllers/test')

// get all data from Test table from backlog and clockify
router.get('/all', TestController.all)

module.exports = router
