var express = require("express");
var router = express.Router();
let authorController = require("../controllers/authorController");
const authenticateMiddleware = require("../middlewares/authenticate");
const authorize = require('../middlewares/authorize')


//
router.post("/new-author", authenticateMiddleware.authenticate, authorize.checkAdmin, authorController.createNewAuthor);
router.get("/author", authorController.getAllAuthor, authenticateMiddleware.authenticate, authorize.checkAdmin,);

module.exports = router;
