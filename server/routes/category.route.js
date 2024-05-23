var express = require('express');
var router = express.Router();
let category = require('../controllers/categoryController')
const authenticateMiddleware = require("../middlewares/authenticate");
const authorize = require('../middlewares/authorize')

router.post('/category', authenticateMiddleware.authenticate, category.createNewCategory);
router.get('/category', authenticateMiddleware.authenticate, authorize.checkStudent, category.getAllCategory)
module.exports = router;