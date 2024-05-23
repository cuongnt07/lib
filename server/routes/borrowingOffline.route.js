var express = require("express");
var router = express.Router();
let borrowingOfflineController = require("../controllers/borrowingOffController");
const authenticateMiddleware = require("../middlewares/authenticate");
const authorize = require('../middlewares/authorize')

router.post("/borrowing-offline", authenticateMiddleware.authenticate, authorize.checkStudent, borrowingOfflineController.createNewBorrowingOff);
router.post("/return-book", authenticateMiddleware.authenticate, authorize.checkLibrarian, borrowingOfflineController.returnBookOffline);
router.put("/borrowingOff", authenticateMiddleware.authenticate, authorize.checkLibrarian, borrowingOfflineController.updateBorrowingOff);
router.get("/borrowOffCount/date", authenticateMiddleware.authenticate, authorize.checkLibrarian, borrowingOfflineController.getBorrowOffCountByDateRange);
router.get("/infoBorrowOff", authenticateMiddleware.authenticate, authorize.checkLibrarian, borrowingOfflineController.getInfoBorrowsOff);
router.get("/borrowedOff-book", authenticateMiddleware.authenticate, authorize.checkStudent, borrowingOfflineController.getBorrowedBookOffline);
router.post("/createBorrowing-offline", authenticateMiddleware.authenticate, authorize.checkLibrarian, borrowingOfflineController.newBorrowingOff);

module.exports = router;
