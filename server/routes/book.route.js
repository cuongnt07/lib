var express = require('express');
var router = express.Router();
let bookController = require('../controllers/bookController')
const authenticateMiddleware = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.post('/book', bookController.createNewBook);
router.get('/book', bookController.getAllBook)
router.put('/book/:id',bookController.updateBook)
router.get('/book/search', authenticateMiddleware.authenticate, authorize.checkLibrarian, bookController.searchBook)
router.get('/book/filter', bookController.filterBookByCategory)
router.get('/book/:id', bookController.getBookDetail)
router.get('/book/amount-book/:id',bookController.countBookIdleByBookLineID)

router.get("/book-count", bookController.getBookCount);
router.get("/newBook-count/date", bookController.getNumNewBooks);
module.exports = router;