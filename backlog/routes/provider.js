const express = require('express')
const router = express.Router()
const ProviderController = require('../controllers/ProviderController')

router.post('/add', ProviderController.add)

module.exports = router
