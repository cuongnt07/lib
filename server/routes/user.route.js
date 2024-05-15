var express = require('express');
var router = express.Router();
let LoginController = require('../controllers/userController')
const authenticateMiddleware = require('../middlewares/authenticate')
//
router.post('/login', authenticateMiddleware.authenticate, LoginController.login);

module.exports = router;