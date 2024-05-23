var express = require('express');
var router = express.Router();
let repositoryController = require('../controllers/repositoryController')
const authenticateMiddleware = require("../middlewares/authenticate");

//
router.post('/repository', authenticateMiddleware.authenticate, repositoryController.createNewRepository);
router.get('/repository', authenticateMiddleware.authenticate,  repositoryController.getAllRepository)
router.put('/repository/:id', authenticateMiddleware.authenticate, repositoryController.updateRepository)
module.exports = router;