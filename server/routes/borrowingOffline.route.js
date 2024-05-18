var express = require("express");
var router = express.Router();
let borrowingOfflineController = require("../controllers/borrowingOffController");
const authenticate = require("../middlewares/authenticate");

router.post("/borrowing-offline", authenticate.authenticate, borrowingOfflineController.createNewBorrowingOff);
router.post("/return-book", authenticate.authenticate, borrowingOfflineController.returnBookOffline);
router.put("/borrowingOff", borrowingOfflineController.updateBorrowingOff);
router.get("/borrowOffCount/date", borrowingOfflineController.getBorrowOffCountByDateRange);
router.get("/infoBorrowOff", borrowingOfflineController.getInfoBorrowsOff);
router.get("/borrowedOff-book", borrowingOfflineController.getBorrowedBookOffline);
router.post("/createBorrowing-offline", borrowingOfflineController.newBorrowingOff);

module.exports = router;
