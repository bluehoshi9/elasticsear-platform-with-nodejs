const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController');

router.get('/index', viewController.getIndex);

router.get('/document', viewController.getDocument);

router.get('/search', viewController.doSearch);

module.exports = router;
