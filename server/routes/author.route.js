var express = require("express");
var router = express.Router();
let authorController = require("../controllers/authorController");

//
router.post("/new-author", authorController.createNewAuthor);
router.get("/author", authorController.getAllAuthor);

module.exports = router;
