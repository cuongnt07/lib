var express = require('express');
var router = express.Router();
let borrowingOnlineController = require('../controllers/borrowingOnlController')
let authenticateMiddleware = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
//
router.post('/borrowing-online', authenticateMiddleware.authenticate, authorize.checkStudent, borrowingOnlineController.createNewBorrowingOnl);
router.get('/borrowed-book', authenticateMiddleware.authenticate, authorize.checkStudent, borrowingOnlineController.getBorrowedBookOnline)


router.get(
    "/borrowOnlCount/date", authenticateMiddleware.authenticate, authorize.checkLibrarian,
    borrowingOnlineController.getBorrowOnlCountByDateRange
  );

module.exports = router;