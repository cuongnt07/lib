const express = require('express')
const router = express.Router()
const authenticateMiddleware = require('../middlewares/authenticate')
const testController = require('../controllers/testController')
const authorize = require('../middlewares/authorize')

router.post('/test', authenticateMiddleware.authenticate, authorize.checkLibrarian, testController.login)

module.exports = router;