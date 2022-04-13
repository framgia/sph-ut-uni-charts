const express = require('express')
const router = express.Router()
const TestController = require('../controller/test')

// routes for getting all the tests data for backlog and clockify services
router.get('/all', TestController.all)

module.exports = router
