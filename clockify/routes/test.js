const express = require('express')
const router = express.Router()
const TestController = require('../controllers/test')

// get all data from Test Table
router.get('/all', TestController.all)

module.exports = router
