var express = require('express');
var router = express.Router();
let bookLineController = require('../controllers/bookLineController');
const uploadFiles = require('../middlewares/upload');
const authenticateMiddleware = require("../middlewares/authenticate");
const authorize = require('../middlewares/authorize')


router.post('/book-line', authenticateMiddleware.authenticate, authorize.checkAdmin, uploadFiles, bookLineController.createNewBookLine);
router.put('/book-line/:id', authenticateMiddleware.authenticate, bookLineController.updateBookLine);
router.get('/book-line', authenticateMiddleware.authenticate, authorize.checkStudent, bookLineController.getAllBookLine);

router.get('/bookLine-count', authenticateMiddleware.authenticate, authorize.checkLibrarian, bookLineController.getBookLineCount);

module.exports = router;