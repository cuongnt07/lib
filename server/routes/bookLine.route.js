var express = require('express');
var router = express.Router();
let bookLineController = require('../controllers/bookLineController');
const uploadFiles = require('../middlewares/upload');


router.post('/book-line', uploadFiles, bookLineController.createNewBookLine);
router.put('/book-line/:id',bookLineController.updateBookLine);
router.get('/book-line', bookLineController.getAllBookLine);

router.get('/bookLine-count', bookLineController.getBookLineCount);

module.exports = router;