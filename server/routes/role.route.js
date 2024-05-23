var express = require('express');
var router = express.Router();
let roleController = require('../controllers/roleController')
const authenticateMiddleware = require("../middlewares/authenticate");

//
router.post('/role', authenticateMiddleware.authenticate, roleController.createNewRole);

module.exports = router;