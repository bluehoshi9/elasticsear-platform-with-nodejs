const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController');

router.get('/index/:index?', viewController.getIndex);

router.get('/document/:index?/:id?', viewController.getDocument);

router.get('/search', viewController.doSearch);

module.exports = router;
