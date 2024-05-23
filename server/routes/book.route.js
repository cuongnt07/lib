var express = require('express');
var router = express.Router();
let bookController = require('../controllers/bookController')
const authenticateMiddleware = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.post('/book', authenticateMiddleware.authenticate, authorize.checkAdmin, bookController.createNewBook);
router.get('/book', authenticateMiddleware.authenticate, authorize.checkStudent, bookController.getAllBook)
router.put('/book/:id', authenticateMiddleware.authenticate, bookController.updateBook)
router.get('/book/search', authenticateMiddleware.authenticate, authorize.checkStudent, bookController.searchBook)
router.get('/book/filter', authenticateMiddleware.authenticate, authorize.checkStudent, bookController.filterBookByCategory)
router.get('/book/:id', authenticateMiddleware.authenticate, bookController.getBookDetail)
router.get('/book/amount-book/:id', bookController.countBookIdleByBookLineID)

router.get("/book-count", authenticateMiddleware.authenticate, authorize.checkLibrarian, bookController.getBookCount);
router.get("/newBook-count/date", authenticateMiddleware.authenticate, authorize.checkLibrarian, bookController.getNumNewBooks);
module.exports = router;