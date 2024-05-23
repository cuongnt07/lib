var express = require('express');
var router = express.Router();
let authorBookController = require('../controllers/authorBookController')
const authenticateMiddleware = require("../middlewares/authenticate");


//
router.post('/author-book', authenticateMiddleware.authenticate, authorBookController.createNewAuthorBook);

module.exports = router;