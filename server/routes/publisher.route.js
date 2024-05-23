var express = require('express');
var router = express.Router();
let publisher = require('../controllers/publisherController')
const authenticateMiddleware = require("../middlewares/authenticate");

//
router.post('/publisher', authenticateMiddleware.authenticate, publisher.createNewPublisher);

module.exports = router;